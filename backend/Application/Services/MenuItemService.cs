using Application.DTOs.MenuItem;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;
using static Application.Shared.Result;

namespace Application.Services;

public class MenuItemService(IUnitOfWork unitOfWork, IValidationService validationService) : IMenuItemService
{
    public async Task<Result<IReadOnlyCollection<MenuItemResponse>>> GetAllAsync()
    {
        try
        {
            var items = await unitOfWork.MenuItems.GetAllAsync();
            var response = items.Adapt<IReadOnlyCollection<MenuItemResponse>>();
            return Result<IReadOnlyCollection<MenuItemResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<MenuItemResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<IReadOnlyCollection<MenuItemResponse>>> GetByCategoryAsync(Guid categoryId)
    {
        try
        {
            var items = await unitOfWork.MenuItems.GetByCategoryIdAsync(categoryId);
            var response = items.Adapt<IReadOnlyCollection<MenuItemResponse>>();
            return Result<IReadOnlyCollection<MenuItemResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<MenuItemResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<IReadOnlyCollection<MenuItemResponse>>> GetFeaturedAsync()
    {
        try
        {
            var items = await unitOfWork.MenuItems.GetFeaturedItemsAsync();
            var response = items.Adapt<IReadOnlyCollection<MenuItemResponse>>();
            return Result<IReadOnlyCollection<MenuItemResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<MenuItemResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<MenuItemResponse>> GetByIdAsync(Guid id)
    {
        try
        {
            var item = await unitOfWork.MenuItems.GetByIdAsync(id);
            if (item == null)
                return Result<MenuItemResponse>.Failure("Menu item not found", ErrorType.NotFound);

            return Result<MenuItemResponse>.Success(item.Adapt<MenuItemResponse>());
        }
        catch (Exception ex)
        {
            return Result<MenuItemResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<MenuItemResponse>> CreateAsync(MenuItemRequest request)
    {
        try
        {
            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<MenuItemResponse>.Failure(validation.Error, validation.ErrorType);

            var category = await unitOfWork.Categories.GetByIdAsync(request.CategoryId);
            if (category == null)
                return Result<MenuItemResponse>.Failure("Category not found", ErrorType.BadRequest);

            var item = request.Adapt<MenuItem>();
            await unitOfWork.MenuItems.AddAsync(item);
            await unitOfWork.SaveChangesAsync();

            var created = await unitOfWork.MenuItems.GetByIdAsync(item.Id);
            return Result<MenuItemResponse>.Success(created!.Adapt<MenuItemResponse>());
        }
        catch (Exception ex)
        {
            return Result<MenuItemResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<MenuItemResponse>> UpdateAsync(Guid id, MenuItemRequest request)
    {
        try
        {
            var existing = await unitOfWork.MenuItems.GetByIdTrackingAsync(id);
            if (existing == null)
                return Result<MenuItemResponse>.Failure("Menu item not found", ErrorType.NotFound);

            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<MenuItemResponse>.Failure(validation.Error, validation.ErrorType);

            if (existing.CategoryId != request.CategoryId)
            {
                var category = await unitOfWork.Categories.GetByIdAsync(request.CategoryId);
                if (category == null)
                    return Result<MenuItemResponse>.Failure("Category not found", ErrorType.BadRequest);
            }

            existing.CategoryId = request.CategoryId;
            existing.NameEn = request.NameEn;
            existing.NameAr = request.NameAr;
            existing.DescriptionEn = request.DescriptionEn;
            existing.DescriptionAr = request.DescriptionAr;
            existing.Price = request.Price;
            existing.ImageUrl = request.ImageUrl;
            existing.IsAvailable = request.IsAvailable;
            existing.IsFeatured = request.IsFeatured;
            existing.DisplayOrder = request.DisplayOrder;
            existing.UpdatedAt = DateTime.UtcNow;

            await unitOfWork.SaveChangesAsync();

            var updated = await unitOfWork.MenuItems.GetByIdAsync(id);
            return Result<MenuItemResponse>.Success(updated!.Adapt<MenuItemResponse>());
        }
        catch (Exception ex)
        {
            return Result<MenuItemResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        try
        {
            var existing = await unitOfWork.MenuItems.GetByIdTrackingAsync(id);
            if (existing == null)
                return Failure("Menu item not found", ErrorType.NotFound);

            unitOfWork.MenuItems.Delete(existing);
            await unitOfWork.SaveChangesAsync();

            return Success;
        }
        catch (Exception ex)
        {
            return Failure(ex.Message, ErrorType.InternalServerError);
        }
    }
}

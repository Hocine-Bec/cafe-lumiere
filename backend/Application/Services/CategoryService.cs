using Application.DTOs.Category;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;
using static Application.Shared.Result;

namespace Application.Services;

public class CategoryService(IUnitOfWork unitOfWork, IValidationService validationService) : ICategoryService
{
    public async Task<Result<IReadOnlyCollection<CategoryResponse>>> GetAllAsync()
    {
        try
        {
            var categories = await unitOfWork.Categories.GetAllAsync();
            var response = categories.Adapt<IReadOnlyCollection<CategoryResponse>>();
            return Result<IReadOnlyCollection<CategoryResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<CategoryResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<IReadOnlyCollection<CategoryResponse>>> GetActiveCategoriesAsync()
    {
        try
        {
            var categories = await unitOfWork.Categories.GetActiveCategoriesAsync();
            var response = categories.Adapt<IReadOnlyCollection<CategoryResponse>>();
            return Result<IReadOnlyCollection<CategoryResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<CategoryResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<CategoryResponse>> GetByIdAsync(Guid id)
    {
        try
        {
            var category = await unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
                return Result<CategoryResponse>.Failure("Category not found", ErrorType.NotFound);

            return Result<CategoryResponse>.Success(category.Adapt<CategoryResponse>());
        }
        catch (Exception ex)
        {
            return Result<CategoryResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request)
    {
        try
        {
            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<CategoryResponse>.Failure(validation.Error, validation.ErrorType);

            var category = request.Adapt<Category>();
            await unitOfWork.Categories.AddAsync(category);
            await unitOfWork.SaveChangesAsync();

            return Result<CategoryResponse>.Success(category.Adapt<CategoryResponse>());
        }
        catch (Exception ex)
        {
            return Result<CategoryResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<CategoryResponse>> UpdateAsync(Guid id, CategoryRequest request)
    {
        try
        {
            var existing = await unitOfWork.Categories.GetByIdTrackingAsync(id);
            if (existing == null)
                return Result<CategoryResponse>.Failure("Category not found", ErrorType.NotFound);

            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<CategoryResponse>.Failure(validation.Error, validation.ErrorType);

            existing.NameEn = request.NameEn;
            existing.NameAr = request.NameAr;
            existing.DisplayOrder = request.DisplayOrder;
            existing.IsActive = request.IsActive;

            await unitOfWork.SaveChangesAsync();

            return Result<CategoryResponse>.Success(existing.Adapt<CategoryResponse>());
        }
        catch (Exception ex)
        {
            return Result<CategoryResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        try
        {
            var existing = await unitOfWork.Categories.GetByIdTrackingAsync(id);
            if (existing == null)
                return Failure("Category not found", ErrorType.NotFound);

            if (existing.MenuItems != null && existing.MenuItems.Count > 0)
                return Failure("Cannot delete category with existing menu items", ErrorType.Conflict);

            unitOfWork.Categories.Delete(existing);
            await unitOfWork.SaveChangesAsync();

            return Success;
        }
        catch (Exception ex)
        {
            return Failure(ex.Message, ErrorType.InternalServerError);
        }
    }
}

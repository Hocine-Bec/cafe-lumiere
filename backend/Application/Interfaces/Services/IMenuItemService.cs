using Application.DTOs.MenuItem;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IMenuItemService
{
    Task<Result<IReadOnlyCollection<MenuItemResponse>>> GetAllAsync();
    Task<Result<IReadOnlyCollection<MenuItemResponse>>> GetByCategoryAsync(Guid categoryId);
    Task<Result<IReadOnlyCollection<MenuItemResponse>>> GetFeaturedAsync();
    Task<Result<MenuItemResponse>> GetByIdAsync(Guid id);
    Task<Result<MenuItemResponse>> CreateAsync(MenuItemRequest request);
    Task<Result<MenuItemResponse>> UpdateAsync(Guid id, MenuItemRequest request);
    Task<Result> DeleteAsync(Guid id);
}

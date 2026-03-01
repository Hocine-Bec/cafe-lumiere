using Application.DTOs.Category;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface ICategoryService
{
    Task<Result<IReadOnlyCollection<CategoryResponse>>> GetAllAsync();
    Task<Result<IReadOnlyCollection<CategoryResponse>>> GetActiveCategoriesAsync();
    Task<Result<CategoryResponse>> GetByIdAsync(Guid id);
    Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request);
    Task<Result<CategoryResponse>> UpdateAsync(Guid id, CategoryRequest request);
    Task<Result> DeleteAsync(Guid id);
}

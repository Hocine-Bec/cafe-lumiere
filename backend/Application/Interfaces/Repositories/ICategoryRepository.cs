using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<Category?> GetByIdAsync(Guid id);
    Task<Category?> GetByIdTrackingAsync(Guid id);
    Task<IEnumerable<Category>> GetAllAsync();
    Task AddAsync(Category entity);
    void Update(Category entity);
    void Delete(Category entity);
    Task<IEnumerable<Category>> GetActiveCategoriesAsync();
}

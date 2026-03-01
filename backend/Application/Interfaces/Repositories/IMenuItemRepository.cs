using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IMenuItemRepository
{
    Task<MenuItem?> GetByIdAsync(Guid id);
    Task<MenuItem?> GetByIdTrackingAsync(Guid id);
    Task<IEnumerable<MenuItem>> GetAllAsync();
    Task AddAsync(MenuItem entity);
    void Update(MenuItem entity);
    void Delete(MenuItem entity);
    Task<IEnumerable<MenuItem>> GetByCategoryIdAsync(Guid categoryId);
    Task<IEnumerable<MenuItem>> GetFeaturedItemsAsync();
    Task<IEnumerable<MenuItem>> GetAvailableItemsAsync();
}

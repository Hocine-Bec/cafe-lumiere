using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class MenuItemRepository(AppDbContext context) : IMenuItemRepository
{
    public async Task<MenuItem?> GetByIdAsync(Guid id) =>
        await context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task<IEnumerable<MenuItem>> GetAllAsync() =>
        await context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .ToListAsync();

    public async Task AddAsync(MenuItem entity) =>
        await context.MenuItems.AddAsync(entity);

    public void Update(MenuItem entity) =>
        context.MenuItems.Update(entity);

    public void Delete(MenuItem entity) =>
        context.MenuItems.Remove(entity);

    public async Task<MenuItem?> GetByIdTrackingAsync(Guid id) =>
        await context.MenuItems
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

    public async Task<IEnumerable<MenuItem>> GetByCategoryIdAsync(Guid categoryId) =>
        await context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .Where(m => m.CategoryId == categoryId)
            .OrderBy(m => m.DisplayOrder)
            .ToListAsync();

    public async Task<IEnumerable<MenuItem>> GetFeaturedItemsAsync() =>
        await context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .Where(m => m.IsFeatured && m.IsAvailable)
            .OrderBy(m => m.DisplayOrder)
            .ToListAsync();

    public async Task<IEnumerable<MenuItem>> GetAvailableItemsAsync() =>
        await context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .Where(m => m.IsAvailable)
            .OrderBy(m => m.DisplayOrder)
            .ToListAsync();
}

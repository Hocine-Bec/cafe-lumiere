using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CategoryRepository(AppDbContext context) : ICategoryRepository
{
    public async Task<Category?> GetByIdAsync(Guid id) =>
        await context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IEnumerable<Category>> GetAllAsync() =>
        await context.Categories.AsNoTracking().ToListAsync();

    public async Task AddAsync(Category entity) =>
        await context.Categories.AddAsync(entity);

    public void Update(Category entity) =>
        context.Categories.Update(entity);

    public void Delete(Category entity) =>
        context.Categories.Remove(entity);

    public async Task<Category?> GetByIdTrackingAsync(Guid id) =>
        await context.Categories
            .Include(c => c.MenuItems)
            .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IEnumerable<Category>> GetActiveCategoriesAsync() =>
        await context.Categories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();
}

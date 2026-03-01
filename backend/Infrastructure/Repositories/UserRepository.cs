using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<User?> GetByIdAsync(Guid id) =>
        await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id);

    public async Task<IEnumerable<User>> GetAllAsync() =>
        await context.Users.AsNoTracking().ToListAsync();

    public async Task AddAsync(User entity) =>
        await context.Users.AddAsync(entity);

    public void Update(User entity) =>
        context.Users.Update(entity);

    public void Delete(User entity) =>
        context.Users.Remove(entity);

    public async Task<User?> GetByIdTrackingAsync(Guid id) =>
        await context.Users.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetByEmailAsync(string email) =>
        await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);

    public async Task<bool> EmailExistsAsync(string email) =>
        await context.Users.AnyAsync(u => u.Email == email);
}

using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByIdTrackingAsync(Guid id);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User entity);
    void Update(User entity);
    void Delete(User entity);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
}

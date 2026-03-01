using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IContactMessageRepository
{
    Task<ContactMessage?> GetByIdAsync(Guid id);
    Task<ContactMessage?> GetByIdTrackingAsync(Guid id);
    Task<IEnumerable<ContactMessage>> GetAllAsync();
    Task AddAsync(ContactMessage entity);
    void Update(ContactMessage entity);
    void Delete(ContactMessage entity);
    Task<IEnumerable<ContactMessage>> GetUnreadMessagesAsync();
}

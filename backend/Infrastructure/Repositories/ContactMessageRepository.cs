using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ContactMessageRepository(AppDbContext context) : IContactMessageRepository
{
    public async Task<ContactMessage?> GetByIdAsync(Guid id) =>
        await context.ContactMessages.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IEnumerable<ContactMessage>> GetAllAsync() =>
        await context.ContactMessages.AsNoTracking().ToListAsync();

    public async Task AddAsync(ContactMessage entity) =>
        await context.ContactMessages.AddAsync(entity);

    public void Update(ContactMessage entity) =>
        context.ContactMessages.Update(entity);

    public void Delete(ContactMessage entity) =>
        context.ContactMessages.Remove(entity);

    public async Task<ContactMessage?> GetByIdTrackingAsync(Guid id) =>
        await context.ContactMessages.FirstOrDefaultAsync(c => c.Id == id);

    public async Task<IEnumerable<ContactMessage>> GetUnreadMessagesAsync() =>
        await context.ContactMessages
            .AsNoTracking()
            .Where(c => !c.IsRead)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
}

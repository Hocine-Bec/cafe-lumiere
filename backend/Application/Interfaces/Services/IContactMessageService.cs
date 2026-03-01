using Application.DTOs.ContactMessage;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IContactMessageService
{
    Task<Result<IReadOnlyCollection<ContactMessageResponse>>> GetAllAsync();
    Task<Result<IReadOnlyCollection<ContactMessageResponse>>> GetUnreadAsync();
    Task<Result<ContactMessageResponse>> GetByIdAsync(Guid id);
    Task<Result<ContactMessageResponse>> CreateAsync(ContactMessageRequest request);
    Task<Result> MarkAsReadAsync(Guid id);
    Task<Result> DeleteAsync(Guid id);
}

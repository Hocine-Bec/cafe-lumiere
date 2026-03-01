namespace Application.DTOs.ContactMessage;

public record ContactMessageResponse(
    Guid Id,
    string Name,
    string Email,
    string Subject,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);

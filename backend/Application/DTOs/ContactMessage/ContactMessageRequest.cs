namespace Application.DTOs.ContactMessage;

public record ContactMessageRequest(
    string Name,
    string Email,
    string Subject,
    string Message
);

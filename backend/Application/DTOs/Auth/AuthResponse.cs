namespace Application.DTOs.Auth;

public record AuthResponse(
    Guid Id,
    string FullName,
    string Email,
    string Role,
    string Token
);

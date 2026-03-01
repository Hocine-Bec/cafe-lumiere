using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// Represents an admin panel user (Admin or Staff).
/// Authenticated via JWT. Passwords stored as BCrypt hashes.
/// </summary>
public class User
{
    public Guid Id { get; set; }

    /// <summary>
    /// Display name shown in the admin panel.
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Unique email used for login.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// BCrypt-hashed password. Never exposed via API.
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Determines access level in the admin panel.
    /// </summary>
    public UserRole Role { get; set; } = UserRole.Staff;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

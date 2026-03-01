namespace Domain.Enums;

/// <summary>
/// Defines the access level for admin panel users.
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Full access to all admin panel features.
    /// </summary>
    Admin,

    /// <summary>
    /// Limited access — can manage reservations and view messages.
    /// </summary>
    Staff
}

namespace Domain.Entities;

/// <summary>
/// Represents a message submitted through the public contact form.
/// </summary>
public class ContactMessage
{
    public Guid Id { get; set; }

    /// <summary>
    /// Name of the person who submitted the message.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email address for replies.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Subject line of the message.
    /// </summary>
    public string Subject { get; set; } = string.Empty;

    /// <summary>
    /// Full message body.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Whether an admin has viewed this message.
    /// </summary>
    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

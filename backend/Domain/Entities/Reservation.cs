using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// Represents a table reservation submitted by a customer.
/// Supports WhatsApp notification tracking and status lifecycle.
/// </summary>
public class Reservation
{
    public Guid Id { get; set; }

    /// <summary>
    /// Full name of the person making the reservation.
    /// </summary>
    public string CustomerName { get; set; } = string.Empty;

    /// <summary>
    /// Phone number for contact and WhatsApp messaging.
    /// </summary>
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Optional email for confirmation.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Date of the reservation.
    /// </summary>
    public DateOnly Date { get; set; }

    /// <summary>
    /// Requested time slot.
    /// </summary>
    public TimeOnly Time { get; set; }

    /// <summary>
    /// Number of guests.
    /// </summary>
    public int PartySize { get; set; }

    /// <summary>
    /// Optional notes from the customer (allergies, birthday, etc.).
    /// </summary>
    public string? SpecialRequests { get; set; }

    /// <summary>
    /// Current status in the reservation lifecycle.
    /// </summary>
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

    /// <summary>
    /// Tracks whether a WhatsApp confirmation was sent for this reservation.
    /// </summary>
    public bool WhatsAppNotified { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

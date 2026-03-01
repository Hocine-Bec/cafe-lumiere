namespace Domain.Enums;

/// <summary>
/// Represents the lifecycle status of a table reservation.
/// </summary>
public enum ReservationStatus
{
    /// <summary>
    /// Reservation has been submitted but not yet confirmed by staff.
    /// </summary>
    Pending,

    /// <summary>
    /// Staff has confirmed the reservation.
    /// </summary>
    Confirmed,

    /// <summary>
    /// Reservation was cancelled by customer or staff.
    /// </summary>
    Cancelled,

    /// <summary>
    /// Customer has visited and the reservation is fulfilled.
    /// </summary>
    Completed
}

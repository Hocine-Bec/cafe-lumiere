namespace Application.DTOs.Reservation;

public record ReservationResponse(
    Guid Id,
    string CustomerName,
    string Phone,
    string? Email,
    DateOnly Date,
    TimeOnly Time,
    int PartySize,
    string? SpecialRequests,
    string Status,
    bool WhatsAppNotified,
    DateTime CreatedAt
);

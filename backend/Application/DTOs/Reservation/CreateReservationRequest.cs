namespace Application.DTOs.Reservation;

public record CreateReservationRequest(
    string CustomerName,
    string Phone,
    string? Email,
    DateOnly Date,
    TimeOnly Time,
    int PartySize,
    string? SpecialRequests
);

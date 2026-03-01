using Domain.Enums;

namespace Application.DTOs.Reservation;

public record UpdateReservationStatusRequest(
    ReservationStatus Status
);

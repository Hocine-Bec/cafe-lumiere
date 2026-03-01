using Application.DTOs.Reservation;
using Application.Shared;
using Domain.Enums;

namespace Application.Interfaces.Services;

public interface IReservationService
{
    Task<Result<IReadOnlyCollection<ReservationResponse>>> GetAllAsync();
    Task<Result<IReadOnlyCollection<ReservationResponse>>> GetByDateAsync(DateOnly date);
    Task<Result<IReadOnlyCollection<ReservationResponse>>> GetByStatusAsync(ReservationStatus status);
    Task<Result<ReservationResponse>> GetByIdAsync(Guid id);
    Task<Result<ReservationResponse>> CreateAsync(CreateReservationRequest request);
    Task<Result<ReservationResponse>> UpdateStatusAsync(Guid id, UpdateReservationStatusRequest request);
    Task<Result> DeleteAsync(Guid id);
}

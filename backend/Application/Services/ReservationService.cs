using Application.DTOs.Reservation;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using Mapster;
using static Application.Shared.Result;

namespace Application.Services;

public class ReservationService(IUnitOfWork unitOfWork, IValidationService validationService) : IReservationService
{
    public async Task<Result<IReadOnlyCollection<ReservationResponse>>> GetAllAsync()
    {
        try
        {
            var reservations = await unitOfWork.Reservations.GetAllAsync();
            var response = reservations.Adapt<IReadOnlyCollection<ReservationResponse>>();
            return Result<IReadOnlyCollection<ReservationResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<ReservationResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<IReadOnlyCollection<ReservationResponse>>> GetByDateAsync(DateOnly date)
    {
        try
        {
            var reservations = await unitOfWork.Reservations.GetByDateAsync(date);
            var response = reservations.Adapt<IReadOnlyCollection<ReservationResponse>>();
            return Result<IReadOnlyCollection<ReservationResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<ReservationResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<IReadOnlyCollection<ReservationResponse>>> GetByStatusAsync(ReservationStatus status)
    {
        try
        {
            var reservations = await unitOfWork.Reservations.GetByStatusAsync(status);
            var response = reservations.Adapt<IReadOnlyCollection<ReservationResponse>>();
            return Result<IReadOnlyCollection<ReservationResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<ReservationResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<ReservationResponse>> GetByIdAsync(Guid id)
    {
        try
        {
            var reservation = await unitOfWork.Reservations.GetByIdAsync(id);
            if (reservation == null)
                return Result<ReservationResponse>.Failure("Reservation not found", ErrorType.NotFound);

            return Result<ReservationResponse>.Success(reservation.Adapt<ReservationResponse>());
        }
        catch (Exception ex)
        {
            return Result<ReservationResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<ReservationResponse>> CreateAsync(CreateReservationRequest request)
    {
        try
        {
            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<ReservationResponse>.Failure(validation.Error, validation.ErrorType);

            var reservation = request.Adapt<Reservation>();
            await unitOfWork.Reservations.AddAsync(reservation);
            await unitOfWork.SaveChangesAsync();

            return Result<ReservationResponse>.Success(reservation.Adapt<ReservationResponse>());
        }
        catch (Exception ex)
        {
            return Result<ReservationResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<ReservationResponse>> UpdateStatusAsync(Guid id, UpdateReservationStatusRequest request)
    {
        try
        {
            var existing = await unitOfWork.Reservations.GetByIdTrackingAsync(id);
            if (existing == null)
                return Result<ReservationResponse>.Failure("Reservation not found", ErrorType.NotFound);

            existing.Status = request.Status;
            await unitOfWork.SaveChangesAsync();

            return Result<ReservationResponse>.Success(existing.Adapt<ReservationResponse>());
        }
        catch (Exception ex)
        {
            return Result<ReservationResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        try
        {
            var existing = await unitOfWork.Reservations.GetByIdTrackingAsync(id);
            if (existing == null)
                return Failure("Reservation not found", ErrorType.NotFound);

            unitOfWork.Reservations.Delete(existing);
            await unitOfWork.SaveChangesAsync();

            return Success;
        }
        catch (Exception ex)
        {
            return Failure(ex.Message, ErrorType.InternalServerError);
        }
    }
}

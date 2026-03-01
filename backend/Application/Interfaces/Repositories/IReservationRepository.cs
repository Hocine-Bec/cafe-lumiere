using Domain.Entities;
using Domain.Enums;

namespace Application.Interfaces.Repositories;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id);
    Task<Reservation?> GetByIdTrackingAsync(Guid id);
    Task<IEnumerable<Reservation>> GetAllAsync();
    Task AddAsync(Reservation entity);
    void Update(Reservation entity);
    void Delete(Reservation entity);
    Task<IEnumerable<Reservation>> GetByDateAsync(DateOnly date);
    Task<IEnumerable<Reservation>> GetByStatusAsync(ReservationStatus status);
}

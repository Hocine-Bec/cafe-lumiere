using Application.Interfaces.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ReservationRepository(AppDbContext context) : IReservationRepository
{
    public async Task<Reservation?> GetByIdAsync(Guid id) =>
        await context.Reservations.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id);

    public async Task<IEnumerable<Reservation>> GetAllAsync() =>
        await context.Reservations.AsNoTracking().ToListAsync();

    public async Task AddAsync(Reservation entity) =>
        await context.Reservations.AddAsync(entity);

    public void Update(Reservation entity) =>
        context.Reservations.Update(entity);

    public void Delete(Reservation entity) =>
        context.Reservations.Remove(entity);

    public async Task<Reservation?> GetByIdTrackingAsync(Guid id) =>
        await context.Reservations.FirstOrDefaultAsync(r => r.Id == id);

    public async Task<IEnumerable<Reservation>> GetByDateAsync(DateOnly date) =>
        await context.Reservations
            .AsNoTracking()
            .Where(r => r.Date == date)
            .OrderBy(r => r.Time)
            .ToListAsync();

    public async Task<IEnumerable<Reservation>> GetByStatusAsync(ReservationStatus status) =>
        await context.Reservations
            .AsNoTracking()
            .Where(r => r.Status == status)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
}

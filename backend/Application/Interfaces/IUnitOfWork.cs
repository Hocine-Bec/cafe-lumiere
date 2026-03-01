using Application.Interfaces.Repositories;

namespace Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ICategoryRepository Categories { get; }
    IMenuItemRepository MenuItems { get; }
    IReservationRepository Reservations { get; }
    IContactMessageRepository ContactMessages { get; }
    IUserRepository Users { get; }
    Task<int> SaveChangesAsync();
}

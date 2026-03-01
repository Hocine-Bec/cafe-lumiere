using Application.Interfaces;
using Application.Interfaces.Repositories;
using Infrastructure.Data;
using Infrastructure.Repositories;

namespace Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    private ICategoryRepository? _categories;
    private IMenuItemRepository? _menuItems;
    private IReservationRepository? _reservations;
    private IContactMessageRepository? _contactMessages;
    private IUserRepository? _users;

    public UnitOfWork(AppDbContext context) { _context = context; }

    public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);
    public IMenuItemRepository MenuItems => _menuItems ??= new MenuItemRepository(_context);
    public IReservationRepository Reservations => _reservations ??= new ReservationRepository(_context);
    public IContactMessageRepository ContactMessages => _contactMessages ??= new ContactMessageRepository(_context);
    public IUserRepository Users => _users ??= new UserRepository(_context);

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}

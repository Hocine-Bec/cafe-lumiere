using Domain.Entities;

namespace Application.Interfaces.Services;

public interface IAuthService
{
    string GenerateToken(User user);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

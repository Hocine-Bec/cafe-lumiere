using Application.DTOs.Auth;
using Application.Shared;

namespace Application.Interfaces.Services;

public interface IAuthenticationService
{
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request);
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request);
}

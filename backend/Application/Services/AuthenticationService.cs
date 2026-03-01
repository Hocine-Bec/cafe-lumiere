using Application.DTOs.Auth;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Domain.Enums;
using static Application.Shared.Result;

namespace Application.Services;

public class AuthenticationService(
    IUnitOfWork unitOfWork,
    IAuthService authService,
    IValidationService validationService) : IAuthenticationService
{
    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request)
    {
        try
        {
            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<AuthResponse>.Failure(validation.Error, validation.ErrorType);

            var user = await unitOfWork.Users.GetByEmailAsync(request.Email);
            if (user == null)
                return Result<AuthResponse>.Failure("Invalid email or password", ErrorType.Unauthorized);

            if (!authService.VerifyPassword(request.Password, user.PasswordHash))
                return Result<AuthResponse>.Failure("Invalid email or password", ErrorType.Unauthorized);

            var token = authService.GenerateToken(user);
            var response = new AuthResponse(user.Id, user.FullName, user.Email, user.Role.ToString(), token);

            return Result<AuthResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<AuthResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        try
        {
            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<AuthResponse>.Failure(validation.Error, validation.ErrorType);

            var emailExists = await unitOfWork.Users.EmailExistsAsync(request.Email);
            if (emailExists)
                return Result<AuthResponse>.Failure("Email already registered", ErrorType.Conflict);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = authService.HashPassword(request.Password),
                Role = UserRole.Staff,
                CreatedAt = DateTime.UtcNow
            };

            await unitOfWork.Users.AddAsync(user);
            await unitOfWork.SaveChangesAsync();

            var token = authService.GenerateToken(user);
            var response = new AuthResponse(user.Id, user.FullName, user.Email, user.Role.ToString(), token);

            return Result<AuthResponse>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<AuthResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }
}

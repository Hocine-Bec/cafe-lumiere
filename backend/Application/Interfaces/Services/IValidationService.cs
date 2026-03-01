using Application.Shared;

namespace Application.Interfaces.Services;

public interface IValidationService
{
    Task<Result> ValidateAsync<T>(T model);
}

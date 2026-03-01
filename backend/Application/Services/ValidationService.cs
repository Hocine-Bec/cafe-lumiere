using Application.Interfaces.Services;
using Application.Shared;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using static Application.Shared.Result;

namespace Application.Services;

public class ValidationService(IServiceProvider serviceProvider) : IValidationService
{
    public async Task<Result> ValidateAsync<T>(T model)
    {
        var validator = serviceProvider.GetService<IValidator<T>>();
        if (validator == null)
            return Success;

        var validationResult = await validator.ValidateAsync(model);
        if (validationResult.IsValid)
            return Success;

        var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
        return Failure(errors, ErrorType.BadRequest);
    }
}

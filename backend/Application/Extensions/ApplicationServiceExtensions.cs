using Application.Interfaces.Services;
using Application.Mappers;
using Application.Services;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        MappingConfig.RegisterMappings();

        services.AddValidatorsFromAssembly(typeof(ApplicationServiceExtensions).Assembly);

        services.AddScoped<IValidationService, ValidationService>();

        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IMenuItemService, MenuItemService>();
        services.AddScoped<IReservationService, ReservationService>();
        services.AddScoped<IContactMessageService, ContactMessageService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();

        return services;
    }
}

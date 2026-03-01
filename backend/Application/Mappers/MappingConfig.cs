using Application.DTOs.Category;
using Application.DTOs.ContactMessage;
using Application.DTOs.MenuItem;
using Application.DTOs.Reservation;
using Mapster;

namespace Application.Mappers;

public static class MappingConfig
{
    public static void RegisterMappings()
    {
        // Category
        TypeAdapterConfig<Domain.Entities.Category, CategoryResponse>.NewConfig()
            .Map(dest => dest.MenuItemCount, src => src.MenuItems != null ? src.MenuItems.Count : 0);

        TypeAdapterConfig<CategoryRequest, Domain.Entities.Category>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.MenuItems);

        // MenuItem
        TypeAdapterConfig<Domain.Entities.MenuItem, MenuItemResponse>.NewConfig()
            .Map(dest => dest.CategoryNameEn, src => src.Category != null ? src.Category.NameEn : string.Empty)
            .Map(dest => dest.CategoryNameAr, src => src.Category != null ? src.Category.NameAr : string.Empty);

        TypeAdapterConfig<MenuItemRequest, Domain.Entities.MenuItem>.NewConfig()
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Category)
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow)
            .Map(dest => dest.UpdatedAt, _ => DateTime.UtcNow);

        // Reservation
        TypeAdapterConfig<CreateReservationRequest, Domain.Entities.Reservation>.NewConfig()
            .Ignore(dest => dest.Id)
            .Map(dest => dest.Status, _ => Domain.Enums.ReservationStatus.Pending)
            .Map(dest => dest.WhatsAppNotified, _ => false)
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow);

        TypeAdapterConfig<Domain.Entities.Reservation, ReservationResponse>.NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString());

        // ContactMessage
        TypeAdapterConfig<ContactMessageRequest, Domain.Entities.ContactMessage>.NewConfig()
            .Ignore(dest => dest.Id)
            .Map(dest => dest.IsRead, _ => false)
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow);
    }
}

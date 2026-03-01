namespace Application.DTOs.MenuItem;

public record MenuItemRequest(
    Guid CategoryId,
    string NameEn,
    string NameAr,
    string DescriptionEn,
    string DescriptionAr,
    decimal Price,
    string ImageUrl,
    bool IsAvailable = true,
    bool IsFeatured = false,
    int DisplayOrder = 0
);

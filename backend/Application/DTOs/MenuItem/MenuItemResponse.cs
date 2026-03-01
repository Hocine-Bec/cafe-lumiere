namespace Application.DTOs.MenuItem;

public record MenuItemResponse(
    Guid Id,
    Guid CategoryId,
    string CategoryNameEn,
    string CategoryNameAr,
    string NameEn,
    string NameAr,
    string DescriptionEn,
    string DescriptionAr,
    decimal Price,
    string ImageUrl,
    bool IsAvailable,
    bool IsFeatured,
    int DisplayOrder,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

namespace Application.DTOs.Category;

public record CategoryResponse(
    Guid Id,
    string NameEn,
    string NameAr,
    int DisplayOrder,
    bool IsActive,
    int MenuItemCount
);

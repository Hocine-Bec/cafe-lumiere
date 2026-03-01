namespace Application.DTOs.Category;

public record CategoryRequest(
    string NameEn,
    string NameAr,
    int DisplayOrder,
    bool IsActive = true
);

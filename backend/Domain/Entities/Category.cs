namespace Domain.Entities;

/// <summary>
/// Represents a menu category (e.g., Hot Drinks, Cold Drinks, Pastries, Breakfast).
/// Supports bilingual names for Arabic/English display.
/// </summary>
public class Category
{
    public Guid Id { get; set; }

    /// <summary>
    /// English display name for the category.
    /// </summary>
    public string NameEn { get; set; } = string.Empty;

    /// <summary>
    /// Arabic display name for the category.
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// Controls the display order in the menu. Lower values appear first.
    /// </summary>
    public int DisplayOrder { get; set; }

    /// <summary>
    /// Soft toggle to hide a category from the public menu without deleting it.
    /// </summary>
    public bool IsActive { get; set; } = true;

    // Navigation
    public ICollection<MenuItem> MenuItems { get; set; } = [];
}

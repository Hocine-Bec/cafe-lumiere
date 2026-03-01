namespace Domain.Entities;

/// <summary>
/// Represents a single item on the café menu.
/// Supports bilingual content and image display.
/// </summary>
public class MenuItem
{
    public Guid Id { get; set; }

    /// <summary>
    /// Foreign key to the parent category.
    /// </summary>
    public Guid CategoryId { get; set; }

    /// <summary>
    /// English display name.
    /// </summary>
    public string NameEn { get; set; } = string.Empty;

    /// <summary>
    /// Arabic display name.
    /// </summary>
    public string NameAr { get; set; } = string.Empty;

    /// <summary>
    /// English description shown on menu detail view.
    /// </summary>
    public string DescriptionEn { get; set; } = string.Empty;

    /// <summary>
    /// Arabic description shown on menu detail view.
    /// </summary>
    public string DescriptionAr { get; set; } = string.Empty;

    /// <summary>
    /// Price in the restaurant's local currency.
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// URL to the item's image (Cloudinary or Unsplash for demo).
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Whether this item is currently available for ordering.
    /// </summary>
    public bool IsAvailable { get; set; } = true;

    /// <summary>
    /// Whether this item appears in the featured section on the home page.
    /// </summary>
    public bool IsFeatured { get; set; }

    /// <summary>
    /// Controls display order within its category. Lower values appear first.
    /// </summary>
    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Category Category { get; set; } = null!;
}

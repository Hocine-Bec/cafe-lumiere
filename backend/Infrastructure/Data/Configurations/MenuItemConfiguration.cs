using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
    public void Configure(EntityTypeBuilder<MenuItem> builder)
    {
        builder.ToTable("menu_items");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CategoryId)
            .HasColumnName("category_id");

        builder.Property(e => e.NameEn)
            .HasColumnName("name_en")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.NameAr)
            .HasColumnName("name_ar")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.DescriptionEn)
            .HasColumnName("description_en")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(e => e.DescriptionAr)
            .HasColumnName("description_ar")
            .HasMaxLength(1000)
            .IsRequired();

        builder.Property(e => e.Price)
            .HasColumnName("price")
            .HasPrecision(10, 2)
            .IsRequired();

        builder.Property(e => e.ImageUrl)
            .HasColumnName("image_url")
            .HasMaxLength(500);

        builder.Property(e => e.IsAvailable)
            .HasColumnName("is_available");

        builder.Property(e => e.IsFeatured)
            .HasColumnName("is_featured");

        builder.Property(e => e.DisplayOrder)
            .HasColumnName("display_order");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at");

        builder.HasOne(m => m.Category)
            .WithMany(c => c.MenuItems)
            .HasForeignKey(m => m.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(e => e.CategoryId)
            .HasDatabaseName("ix_menu_items_category_id");

        builder.HasIndex(e => e.IsFeatured)
            .HasDatabaseName("ix_menu_items_is_featured");
    }
}

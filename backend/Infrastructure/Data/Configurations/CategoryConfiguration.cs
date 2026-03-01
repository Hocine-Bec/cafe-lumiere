using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.NameEn)
            .HasColumnName("name_en")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.NameAr)
            .HasColumnName("name_ar")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.DisplayOrder)
            .HasColumnName("display_order");

        builder.Property(e => e.IsActive)
            .HasColumnName("is_active");

        builder.HasIndex(e => e.DisplayOrder)
            .HasDatabaseName("ix_categories_display_order");
    }
}

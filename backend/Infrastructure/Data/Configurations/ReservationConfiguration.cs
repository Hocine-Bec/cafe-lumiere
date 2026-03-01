using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configurations;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable("reservations");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id")
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CustomerName)
            .HasColumnName("customer_name")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Phone)
            .HasColumnName("phone")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(200);

        builder.Property(e => e.Date)
            .HasColumnName("date");

        builder.Property(e => e.Time)
            .HasColumnName("time");

        builder.Property(e => e.PartySize)
            .HasColumnName("party_size");

        builder.Property(e => e.SpecialRequests)
            .HasColumnName("special_requests")
            .HasMaxLength(1000);

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.WhatsAppNotified)
            .HasColumnName("whats_app_notified");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at");

        builder.HasIndex(e => e.Date)
            .HasDatabaseName("ix_reservations_date");

        builder.HasIndex(e => e.Status)
            .HasDatabaseName("ix_reservations_status");
    }
}

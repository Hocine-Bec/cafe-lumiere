using Application.DTOs.Reservation;
using FluentValidation;

namespace Application.Validators;

public class CreateReservationRequestValidator : AbstractValidator<CreateReservationRequest>
{
    public CreateReservationRequestValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Phone)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(x => x.Email)
            .EmailAddress()
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.Date)
            .Must(d => d >= DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Reservation date must be today or in the future");

        RuleFor(x => x.PartySize)
            .InclusiveBetween(1, 20);

        RuleFor(x => x.SpecialRequests)
            .MaximumLength(1000)
            .When(x => x.SpecialRequests != null);
    }
}

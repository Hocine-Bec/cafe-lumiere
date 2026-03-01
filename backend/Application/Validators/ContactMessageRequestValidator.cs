using Application.DTOs.ContactMessage;
using FluentValidation;

namespace Application.Validators;

public class ContactMessageRequestValidator : AbstractValidator<ContactMessageRequest>
{
    public ContactMessageRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(200);

        RuleFor(x => x.Subject)
            .NotEmpty()
            .MaximumLength(300);

        RuleFor(x => x.Message)
            .NotEmpty()
            .MaximumLength(5000);
    }
}

using Application.DTOs.Category;
using FluentValidation;

namespace Application.Validators;

public class CategoryRequestValidator : AbstractValidator<CategoryRequest>
{
    public CategoryRequestValidator()
    {
        RuleFor(x => x.NameEn)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.NameAr)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0);
    }
}

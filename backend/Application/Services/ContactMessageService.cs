using Application.DTOs.ContactMessage;
using Application.Interfaces;
using Application.Interfaces.Services;
using Application.Shared;
using Domain.Entities;
using Mapster;
using static Application.Shared.Result;

namespace Application.Services;

public class ContactMessageService(IUnitOfWork unitOfWork, IValidationService validationService) : IContactMessageService
{
    public async Task<Result<IReadOnlyCollection<ContactMessageResponse>>> GetAllAsync()
    {
        try
        {
            var messages = await unitOfWork.ContactMessages.GetAllAsync();
            var response = messages.Adapt<IReadOnlyCollection<ContactMessageResponse>>();
            return Result<IReadOnlyCollection<ContactMessageResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<ContactMessageResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<IReadOnlyCollection<ContactMessageResponse>>> GetUnreadAsync()
    {
        try
        {
            var messages = await unitOfWork.ContactMessages.GetUnreadMessagesAsync();
            var response = messages.Adapt<IReadOnlyCollection<ContactMessageResponse>>();
            return Result<IReadOnlyCollection<ContactMessageResponse>>.Success(response);
        }
        catch (Exception ex)
        {
            return Result<IReadOnlyCollection<ContactMessageResponse>>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<ContactMessageResponse>> GetByIdAsync(Guid id)
    {
        try
        {
            var message = await unitOfWork.ContactMessages.GetByIdAsync(id);
            if (message == null)
                return Result<ContactMessageResponse>.Failure("Contact message not found", ErrorType.NotFound);

            return Result<ContactMessageResponse>.Success(message.Adapt<ContactMessageResponse>());
        }
        catch (Exception ex)
        {
            return Result<ContactMessageResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result<ContactMessageResponse>> CreateAsync(ContactMessageRequest request)
    {
        try
        {
            var validation = await validationService.ValidateAsync(request);
            if (!validation.IsSuccess)
                return Result<ContactMessageResponse>.Failure(validation.Error, validation.ErrorType);

            var message = request.Adapt<ContactMessage>();
            await unitOfWork.ContactMessages.AddAsync(message);
            await unitOfWork.SaveChangesAsync();

            return Result<ContactMessageResponse>.Success(message.Adapt<ContactMessageResponse>());
        }
        catch (Exception ex)
        {
            return Result<ContactMessageResponse>.Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result> MarkAsReadAsync(Guid id)
    {
        try
        {
            var existing = await unitOfWork.ContactMessages.GetByIdTrackingAsync(id);
            if (existing == null)
                return Failure("Contact message not found", ErrorType.NotFound);

            existing.IsRead = true;
            await unitOfWork.SaveChangesAsync();

            return Success;
        }
        catch (Exception ex)
        {
            return Failure(ex.Message, ErrorType.InternalServerError);
        }
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        try
        {
            var existing = await unitOfWork.ContactMessages.GetByIdTrackingAsync(id);
            if (existing == null)
                return Failure("Contact message not found", ErrorType.NotFound);

            unitOfWork.ContactMessages.Delete(existing);
            await unitOfWork.SaveChangesAsync();

            return Success;
        }
        catch (Exception ex)
        {
            return Failure(ex.Message, ErrorType.InternalServerError);
        }
    }
}

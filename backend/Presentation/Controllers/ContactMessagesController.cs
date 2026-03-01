using Application.DTOs.ContactMessage;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[Route("api/contact-messages")]
[ApiController]
[Authorize]
public class ContactMessagesController(IContactMessageService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var result = await service.GetAllAsync();
        return result.HandleResult();
    }

    [HttpGet("unread")]
    public async Task<ActionResult> GetUnread()
    {
        var result = await service.GetUnreadAsync();
        return result.HandleResult();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var result = await service.GetByIdAsync(id);
        return result.HandleResult();
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult> Create([FromBody] ContactMessageRequest request)
    {
        var result = await service.CreateAsync(request);
        return result.HandleCreatedResult(nameof(GetById), null!, new { id = result.Value?.Id });
    }

    [HttpPatch("{id:guid}/read")]
    public async Task<ActionResult> MarkAsRead(Guid id)
    {
        var result = await service.MarkAsReadAsync(id);
        return result.HandleResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await service.DeleteAsync(id);
        return result.HandleResult();
    }
}

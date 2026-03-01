using Application.DTOs.Reservation;
using Application.Interfaces.Services;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[Route("api/reservations")]
[ApiController]
[Authorize]
public class ReservationsController(IReservationService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var result = await service.GetAllAsync();
        return result.HandleResult();
    }

    [HttpGet("date/{date}")]
    public async Task<ActionResult> GetByDate(DateOnly date)
    {
        var result = await service.GetByDateAsync(date);
        return result.HandleResult();
    }

    [HttpGet("status/{status}")]
    public async Task<ActionResult> GetByStatus(ReservationStatus status)
    {
        var result = await service.GetByStatusAsync(status);
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
    public async Task<ActionResult> Create([FromBody] CreateReservationRequest request)
    {
        var result = await service.CreateAsync(request);
        return result.HandleCreatedResult(nameof(GetById), null!, new { id = result.Value?.Id });
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] UpdateReservationStatusRequest request)
    {
        var result = await service.UpdateStatusAsync(id, request);
        return result.HandleResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await service.DeleteAsync(id);
        return result.HandleResult();
    }
}

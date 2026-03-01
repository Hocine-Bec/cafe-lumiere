using Application.DTOs.MenuItem;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[Route("api/menu-items")]
[ApiController]
[Authorize]
public class MenuItemsController(IMenuItemService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetAll()
    {
        var result = await service.GetAllAsync();
        return result.HandleResult();
    }

    [HttpGet("category/{categoryId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetByCategory(Guid categoryId)
    {
        var result = await service.GetByCategoryAsync(categoryId);
        return result.HandleResult();
    }

    [HttpGet("featured")]
    [AllowAnonymous]
    public async Task<ActionResult> GetFeatured()
    {
        var result = await service.GetFeaturedAsync();
        return result.HandleResult();
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult> GetById(Guid id)
    {
        var result = await service.GetByIdAsync(id);
        return result.HandleResult();
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] MenuItemRequest request)
    {
        var result = await service.CreateAsync(request);
        return result.HandleCreatedResult(nameof(GetById), null!, new { id = result.Value?.Id });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] MenuItemRequest request)
    {
        var result = await service.UpdateAsync(id, request);
        return result.HandleResult();
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var result = await service.DeleteAsync(id);
        return result.HandleResult();
    }
}

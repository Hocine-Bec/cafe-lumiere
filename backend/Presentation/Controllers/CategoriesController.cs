using Application.DTOs.Category;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[Route("api/categories")]
[ApiController]
[Authorize]
public class CategoriesController(ICategoryService service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult> GetAll()
    {
        var result = await service.GetAllAsync();
        return result.HandleResult();
    }

    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<ActionResult> GetActive()
    {
        var result = await service.GetActiveCategoriesAsync();
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
    public async Task<ActionResult> Create([FromBody] CategoryRequest request)
    {
        var result = await service.CreateAsync(request);
        return result.HandleCreatedResult(nameof(GetById), null!, new { id = result.Value?.Id });
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult> Update(Guid id, [FromBody] CategoryRequest request)
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

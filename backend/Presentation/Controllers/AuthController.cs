using Application.DTOs.Auth;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Extensions;

namespace Presentation.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController(IAuthenticationService service) : ControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await service.LoginAsync(request);
        return result.HandleResult();
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await service.RegisterAsync(request);
        return result.HandleCreatedResult(nameof(Register), null!, new { });
    }
}

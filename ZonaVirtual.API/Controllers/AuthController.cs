using Microsoft.AspNetCore.Mvc;
using ZonaVirtual.Application.DTOs;
using ZonaVirtual.Application.Services;

namespace ZonaVirtual.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService) => _authService = authService;

    [HttpPost("Verificar")]
    public async Task<IActionResult> Verificar([FromBody] VerificarUsuarioRequest request)
    {
        var result = await _authService.VerificarUsuarioAsync(request.Identificacion);
        return Ok(result);
    }

    [HttpPost("Registro")]
    public async Task<IActionResult> Registro([FromBody] RegistroRequest request)
    {
        if (request.Perfil is not (1 or 2))
            return BadRequest(new { mensaje = "Perfil inválido. Use 1=Pagador o 2=Comercio." });

        var result = await _authService.RegistrarAsync(request);
        if (result == null)
            return Conflict(new { mensaje = "Ya existe un usuario con esa identificación." });

        return Ok(result);
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);
        if (result == null)
            return Unauthorized(new { mensaje = "Credenciales inválidas." });

        return Ok(result);
    }
}

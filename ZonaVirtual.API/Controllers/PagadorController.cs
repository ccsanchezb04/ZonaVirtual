using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZonaVirtual.Application.DTOs;
using ZonaVirtual.Application.Services;

namespace ZonaVirtual.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PagadorController : ControllerBase
{
    private readonly PagadorService _pagadorService;

    public PagadorController(PagadorService pagadorService) => _pagadorService = pagadorService;

    private int GetUsuarioId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("Comercios")]
    public async Task<IActionResult> GetComercios()
    {
        var comercios = await _pagadorService.GetComerciosAsync();
        return Ok(comercios);
    }

    [HttpGet("Transacciones")]
    public async Task<IActionResult> GetTransacciones()
    {
        var transacciones = await _pagadorService.GetMisTransaccionesAsync(GetUsuarioId());
        return Ok(transacciones);
    }

    [HttpPost("Transacciones")]
    public async Task<IActionResult> CrearTransaccion([FromBody] CrearTransaccionRequest request)
    {
        var (success, message, data) = await _pagadorService.CrearTransaccionAsync(GetUsuarioId(), request);
        if (!success)
            return Conflict(new { mensaje = message });

        return Created(string.Empty, data);
    }
}

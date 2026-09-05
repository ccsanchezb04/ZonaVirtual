using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZonaVirtual.Application.DTOs;
using ZonaVirtual.Application.Services;

namespace ZonaVirtual.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComercioController : ControllerBase
{
    private readonly ComercioService _comercioService;

    public ComercioController(ComercioService comercioService) => _comercioService = comercioService;

    private int GetComercioId()
    {
        var comercioIdStr = User.FindFirstValue("comercioId");
        return int.TryParse(comercioIdStr, out var id) ? id : 0;
    }

    [HttpGet("Transacciones")]
    public async Task<IActionResult> GetTransacciones(
        [FromQuery] DateTime? fecha,
        [FromQuery] int? codigo,
        [FromQuery] string? identificacionUsuario)
    {
        var comercioId = GetComercioId();
        if (comercioId == 0)
            return Forbid();

        var transacciones = await _comercioService.GetTransaccionesAsync(
            comercioId, fecha, codigo, identificacionUsuario);
        return Ok(transacciones);
    }

    [HttpGet("TotalTransacciones")]
    public async Task<IActionResult> GetTotal()
    {
        var comercioId = GetComercioId();
        if (comercioId == 0)
            return Forbid();

        var total = await _comercioService.GetTotalTransaccionesAsync(comercioId);
        return Ok(new { total });
    }
     
    [HttpPut("Transacciones/{id}")]
    public async Task<IActionResult> ModificarTransaccion(int id, [FromBody] ModificarTransaccionRequest request)
    {
        var comercioId = GetComercioId();
        if (comercioId == 0)
            return Forbid();

        var (success, message) = await _comercioService.ModificarTransaccionAsync(id, comercioId, request);
        if (!success)
            return BadRequest(new { mensaje = message });

        return Ok(new { mensaje = message });
    }
}

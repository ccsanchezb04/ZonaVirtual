using Microsoft.AspNetCore.Mvc;
using ZonaVirtual.Application.Services;

namespace ZonaVirtual.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PruebaController : ControllerBase
{
    private readonly PruebaService _pruebaService;

    public PruebaController(PruebaService pruebaService) => _pruebaService = pruebaService;

    [HttpPost("GenerarDatos")]
    public async Task<IActionResult> GenerarDatos([FromQuery] int comercios = 5, [FromQuery] int usuarios = 10, [FromQuery] int transaccionesPorUsuario = 3)
    {
        var resultado = await _pruebaService.GenerarDatosAsync(comercios, usuarios, transaccionesPorUsuario);
        return Ok(new { mensaje = resultado });
    }

    [HttpPost("SeedTestUsers")]
    public async Task<IActionResult> SeedTestUsers()
    {
        var resultado = await _pruebaService.SeedTestUsersAsync();
        return Ok(new { mensaje = resultado });
    }
}

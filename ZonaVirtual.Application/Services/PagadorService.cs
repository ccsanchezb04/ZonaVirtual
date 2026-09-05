using ZonaVirtual.Application.DTOs;
using ZonaVirtual.Domain.Entities;
using ZonaVirtual.Domain.Interfaces;

namespace ZonaVirtual.Application.Services;

public class PagadorService
{
    private readonly ITransaccionRepository _transaccionRepo;
    private readonly IComercioRepository _comercioRepo;

    private static readonly Dictionary<int, string> MediosPago = new()
    {
        { 32, "Tarjeta de Crédito" }, { 29, "PSE" }, { 41, "Gana" }, { 42, "Caja" }
    };

    private static readonly Dictionary<int, string> Estados = new()
    {
        { 1, "Aprobada" }, { 999, "Pendiente" }, { 1000, "Rechazada" }, { 1001, "Rechazada SR" }
    };

    public PagadorService(ITransaccionRepository transaccionRepo, IComercioRepository comercioRepo)
    {
        _transaccionRepo = transaccionRepo;
        _comercioRepo = comercioRepo;
    }

    public async Task<IEnumerable<TransaccionDto>> GetMisTransaccionesAsync(int usuarioId)
    {
        var transacciones = await _transaccionRepo.GetByUsuarioIdAsync(usuarioId);
        return transacciones.Select(MapToDto);
    }

    public async Task<IEnumerable<ComercioDto>> GetComerciosAsync()
    {
        var comercios = await _comercioRepo.GetAllAsync();
        return comercios.Select(c => new ComercioDto(c.Id, c.Codigo, c.Nombre, c.Nit, c.Direccion));
    }

    public async Task<(bool Success, string Message, TransaccionDto? Data)> CrearTransaccionAsync(
        int usuarioId, CrearTransaccionRequest request)
    {
        var codigo = await _transaccionRepo.GetNextCodigoAsync();

        var transaccion = new Transaccion
        {
            Codigo = codigo,
            MedioPago = request.MedioPago,
            Estado = 999, // Pendiente — el comercio actualiza el estado
            Total = request.Total,
            Fecha = DateTime.Now,
            Concepto = request.Concepto,
            UsuarioId = usuarioId,
            ComercioId = request.ComercioId
        };

        await _transaccionRepo.AddAsync(transaccion);
        await _transaccionRepo.SaveChangesAsync();

        var saved = await _transaccionRepo.GetByIdAsync(transaccion.Id);
        return (true, "Transacción creada.", MapToDto(saved!));
    }

    private static TransaccionDto MapToDto(Transaccion t) => new(
        t.Id, t.Codigo,
        t.MedioPago, MediosPago.GetValueOrDefault(t.MedioPago, t.MedioPago.ToString()),
        t.Estado, Estados.GetValueOrDefault(t.Estado, t.Estado.ToString()),
        t.Total, t.Fecha, t.Concepto,
        t.Comercio?.Nombre,
        t.Usuario?.Nombre,
        t.Usuario?.Identificacion
    );
}

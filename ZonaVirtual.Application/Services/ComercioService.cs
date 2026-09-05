using ZonaVirtual.Application.DTOs;
using ZonaVirtual.Domain.Interfaces;

namespace ZonaVirtual.Application.Services;

public class ComercioService
{
    private readonly ITransaccionRepository _transaccionRepo;
    private readonly IUsuarioRepository _usuarioRepo;

    private static readonly Dictionary<int, string> MediosPago = new()
    {
        { 32, "Tarjeta de Crédito" }, { 29, "PSE" }, { 41, "Gana" }, { 42, "Caja" }
    };

    private static readonly Dictionary<int, string> Estados = new()
    {
        { 1, "Aprobada" }, { 999, "Pendiente" }, { 1000, "Rechazada" }, { 1001, "Rechazada SR" }
    };

    public ComercioService(ITransaccionRepository transaccionRepo, IUsuarioRepository usuarioRepo)
    {
        _transaccionRepo = transaccionRepo;
        _usuarioRepo = usuarioRepo;
    }

    public async Task<IEnumerable<TransaccionDto>> GetTransaccionesAsync(
        int comercioId, DateTime? fecha, int? codigo, string? identificacionUsuario)
    {
        var transacciones = await _transaccionRepo.GetByComercioIdAsync(
            comercioId, fecha, codigo, identificacionUsuario);

        return transacciones.Select(t => new TransaccionDto(
            t.Id, t.Codigo,
            t.MedioPago, MediosPago.GetValueOrDefault(t.MedioPago, t.MedioPago.ToString()),
            t.Estado, Estados.GetValueOrDefault(t.Estado, t.Estado.ToString()),
            t.Total, t.Fecha, t.Concepto,
            t.Comercio?.Nombre,
            t.Usuario?.Nombre,
            t.Usuario?.Identificacion
        ));
    }

    public async Task<decimal> GetTotalTransaccionesAsync(int comercioId) =>
        await _transaccionRepo.GetTotalByComercioIdAsync(comercioId);

    public async Task<(bool Success, string Message)> ModificarTransaccionAsync(
        int transaccionId, int comercioId, ModificarTransaccionRequest request)
    {
        var transaccion = await _transaccionRepo.GetByIdAsync(transaccionId);

        if (transaccion == null)
            return (false, "Transacción no encontrada.");

        if (transaccion.ComercioId != comercioId)
            return (false, "No tiene permiso para modificar esta transacción.");

        if (transaccion.Estado == 1)
            return (false, "No se puede modificar una transacción Aprobada.");

        transaccion.MedioPago = request.MedioPago;
        transaccion.Estado = request.Estado;
        transaccion.Total = request.Total;
        transaccion.Fecha = request.Fecha;
        transaccion.Concepto = request.Concepto;

        await _transaccionRepo.SaveChangesAsync();
        return (true, "Transacción modificada correctamente.");
    }
}

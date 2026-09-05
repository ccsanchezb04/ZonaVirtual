using Microsoft.EntityFrameworkCore;
using ZonaVirtual.Domain.Entities;
using ZonaVirtual.Domain.Interfaces;
using ZonaVirtual.Infrastructure.Data;

namespace ZonaVirtual.Infrastructure.Repositories;

public class TransaccionRepository : ITransaccionRepository
{
    private readonly AppDbContext _context;

    public TransaccionRepository(AppDbContext context) => _context = context;

    public async Task<bool> ExistsCodigoAsync(int codigo) =>
        await _context.Transacciones.AnyAsync(t => t.Codigo == codigo);

    public async Task<int> GetNextCodigoAsync() =>
        await _context.Transacciones.AnyAsync()
            ? await _context.Transacciones.MaxAsync(t => t.Codigo) + 1
            : 1;

    public async Task<IEnumerable<Transaccion>> GetByUsuarioIdAsync(int usuarioId) =>
        await _context.Transacciones
            .Include(t => t.Comercio)
            .Where(t => t.UsuarioId == usuarioId)
            .OrderByDescending(t => t.Fecha)
            .ToListAsync();

    public async Task<IEnumerable<Transaccion>> GetByComercioIdAsync(
        int comercioId, DateTime? fecha, int? codigo, string? identificacionUsuario)
    {
        var query = _context.Transacciones
            .Include(t => t.Usuario)
            .Where(t => t.ComercioId == comercioId);

        if (fecha.HasValue)
            query = query.Where(t => t.Fecha.Date == fecha.Value.Date);

        if (codigo.HasValue)
            query = query.Where(t => t.Codigo == codigo.Value);

        if (!string.IsNullOrWhiteSpace(identificacionUsuario))
            query = query.Where(t => t.Usuario!.Identificacion == identificacionUsuario);

        return await query.OrderByDescending(t => t.Fecha).ToListAsync();
    }

    public async Task<decimal> GetTotalByComercioIdAsync(int comercioId) =>
        await _context.Transacciones
            .Where(t => t.ComercioId == comercioId)
            .SumAsync(t => t.Total);

    public async Task<Transaccion?> GetByIdAsync(int id) =>
        await _context.Transacciones.Include(t => t.Usuario).Include(t => t.Comercio)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task AddAsync(Transaccion transaccion) =>
        await _context.Transacciones.AddAsync(transaccion);

    public async Task AddRangeAsync(IEnumerable<Transaccion> transacciones) =>
        await _context.Transacciones.AddRangeAsync(transacciones);

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}

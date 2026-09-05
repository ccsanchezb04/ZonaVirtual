using ZonaVirtual.Domain.Entities;

namespace ZonaVirtual.Domain.Interfaces;

public interface ITransaccionRepository
{
    Task<bool> ExistsCodigoAsync(int codigo);
    Task<int> GetNextCodigoAsync();
    Task<IEnumerable<Transaccion>> GetByUsuarioIdAsync(int usuarioId);
    Task<IEnumerable<Transaccion>> GetByComercioIdAsync(int comercioId, DateTime? fecha, int? codigo, string? identificacionUsuario);
    Task<decimal> GetTotalByComercioIdAsync(int comercioId);
    Task<Transaccion?> GetByIdAsync(int id);
    Task AddAsync(Transaccion transaccion);
    Task AddRangeAsync(IEnumerable<Transaccion> transacciones);
    Task SaveChangesAsync();
}

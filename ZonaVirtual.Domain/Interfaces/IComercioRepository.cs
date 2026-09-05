using ZonaVirtual.Domain.Entities;

namespace ZonaVirtual.Domain.Interfaces;

public interface IComercioRepository
{
    Task<IEnumerable<Comercio>> GetAllAsync();
    Task<Comercio?> GetByIdAsync(int id);
    Task<Comercio?> GetByCodigoAsync(int codigo);
    Task AddAsync(Comercio comercio);
    Task AddRangeAsync(IEnumerable<Comercio> comercios);
    Task SaveChangesAsync();
}

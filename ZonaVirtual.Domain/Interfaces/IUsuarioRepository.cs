using ZonaVirtual.Domain.Entities;

namespace ZonaVirtual.Domain.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByIdentificacionAsync(string identificacion);
    Task<Usuario?> GetByEmailAsync(string email);
    Task<Usuario?> GetByIdAsync(int id);
    Task AddAsync(Usuario usuario);
    Task AddRangeAsync(IEnumerable<Usuario> usuarios);
    Task SaveChangesAsync();
}

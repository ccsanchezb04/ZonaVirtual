using Microsoft.EntityFrameworkCore;
using ZonaVirtual.Domain.Entities;
using ZonaVirtual.Domain.Interfaces;
using ZonaVirtual.Infrastructure.Data;

namespace ZonaVirtual.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context) => _context = context;

    public async Task<Usuario?> GetByIdentificacionAsync(string identificacion) =>
        await _context.Usuarios.Include(u => u.Comercio)
            .FirstOrDefaultAsync(u => u.Identificacion == identificacion);

    public async Task<Usuario?> GetByEmailAsync(string email) =>
        await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<Usuario?> GetByIdAsync(int id) =>
        await _context.Usuarios.Include(u => u.Comercio).FirstOrDefaultAsync(u => u.Id == id);

    public async Task AddAsync(Usuario usuario) =>
        await _context.Usuarios.AddAsync(usuario);

    public async Task AddRangeAsync(IEnumerable<Usuario> usuarios) =>
        await _context.Usuarios.AddRangeAsync(usuarios);

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}

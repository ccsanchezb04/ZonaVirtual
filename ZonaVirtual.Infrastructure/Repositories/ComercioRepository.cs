using Microsoft.EntityFrameworkCore;
using ZonaVirtual.Domain.Entities;
using ZonaVirtual.Domain.Interfaces;
using ZonaVirtual.Infrastructure.Data;

namespace ZonaVirtual.Infrastructure.Repositories;

public class ComercioRepository : IComercioRepository
{
    private readonly AppDbContext _context;

    public ComercioRepository(AppDbContext context) => _context = context;

    public async Task<IEnumerable<Comercio>> GetAllAsync() =>
        await _context.Comercios.ToListAsync();

    public async Task<Comercio?> GetByIdAsync(int id) =>
        await _context.Comercios.FindAsync(id);

    public async Task<Comercio?> GetByCodigoAsync(int codigo) =>
        await _context.Comercios.FirstOrDefaultAsync(c => c.Codigo == codigo);

    public async Task AddAsync(Comercio comercio) =>
        await _context.Comercios.AddAsync(comercio);

    public async Task AddRangeAsync(IEnumerable<Comercio> comercios) =>
        await _context.Comercios.AddRangeAsync(comercios);

    public async Task SaveChangesAsync() =>
        await _context.SaveChangesAsync();
}

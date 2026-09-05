using Microsoft.EntityFrameworkCore;
using ZonaVirtual.Domain.Entities;

namespace ZonaVirtual.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Comercio> Comercios => Set<Comercio>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Transaccion> Transacciones => Set<Transaccion>();
    public DbSet<MedioPago> MediosPago => Set<MedioPago>();
    public DbSet<EstadoTransaccion> EstadosTransaccion => Set<EstadoTransaccion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Comercio>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.Codigo).IsUnique();
            e.HasIndex(c => c.Nit).IsUnique();
            e.Property(c => c.Nombre).HasMaxLength(200).IsRequired();
            e.Property(c => c.Nit).HasMaxLength(50).IsRequired();
            e.Property(c => c.Direccion).HasMaxLength(300);
        });

        modelBuilder.Entity<Usuario>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Identificacion).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Identificacion).HasMaxLength(50).IsRequired();
            e.Property(u => u.Nombre).HasMaxLength(200).IsRequired();
            e.Property(u => u.Email).HasMaxLength(200).IsRequired();
            e.Property(u => u.PasswordHash).HasMaxLength(500).IsRequired();
            e.HasOne(u => u.Comercio)
             .WithOne(c => c.UsuarioComercio)
             .HasForeignKey<Usuario>(u => u.ComercioId)
             .IsRequired(false)
             .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Transaccion>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasIndex(t => t.Codigo).IsUnique();
            e.Property(t => t.Total).HasColumnType("decimal(18,2)");
            e.Property(t => t.Concepto).HasMaxLength(500);
            e.HasOne(t => t.Usuario)
             .WithMany(u => u.Transacciones)
             .HasForeignKey(t => t.UsuarioId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(t => t.Comercio)
             .WithMany(c => c.Transacciones)
             .HasForeignKey(t => t.ComercioId)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne<MedioPago>()
             .WithMany()
             .HasForeignKey(t => t.MedioPago)
             .OnDelete(DeleteBehavior.Restrict);
            e.HasOne<EstadoTransaccion>()
             .WithMany()
             .HasForeignKey(t => t.Estado)
             .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MedioPago>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.Descripcion).HasMaxLength(100);
            e.HasData(
                new MedioPago { Id = 32, Descripcion = "Tarjeta de Crédito" },
                new MedioPago { Id = 29, Descripcion = "PSE" },
                new MedioPago { Id = 41, Descripcion = "Gana" },
                new MedioPago { Id = 42, Descripcion = "Caja" }
            );
        });

        modelBuilder.Entity<EstadoTransaccion>(e =>
        {
            e.HasKey(es => es.Id);
            e.Property(es => es.Descripcion).HasMaxLength(100);
            e.HasData(
                new EstadoTransaccion { Id = 1, Descripcion = "Aprobada" },
                new EstadoTransaccion { Id = 999, Descripcion = "Pendiente" },
                new EstadoTransaccion { Id = 1000, Descripcion = "Rechazada" },
                new EstadoTransaccion { Id = 1001, Descripcion = "Rechazada SR" }
            );
        });
    }
}

namespace ZonaVirtual.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public string Identificacion { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public int Perfil { get; set; } // 1=Pagador, 2=Comercio

    public int? ComercioId { get; set; }
    public Comercio? Comercio { get; set; }

    public ICollection<Transaccion> Transacciones { get; set; } = new List<Transaccion>();
}

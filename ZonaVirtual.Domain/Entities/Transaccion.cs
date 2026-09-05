namespace ZonaVirtual.Domain.Entities;

public class Transaccion
{
    public int Id { get; set; }
    public int Codigo { get; set; }
    public int MedioPago { get; set; }
    public int Estado { get; set; }
    public decimal Total { get; set; }
    public DateTime Fecha { get; set; }
    public string Concepto { get; set; } = string.Empty;

    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public int ComercioId { get; set; }
    public Comercio? Comercio { get; set; }
}

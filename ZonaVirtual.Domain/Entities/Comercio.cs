namespace ZonaVirtual.Domain.Entities;

public class Comercio
{
    public int Id { get; set; }
    public int Codigo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Nit { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;

    public ICollection<Transaccion> Transacciones { get; set; } = new List<Transaccion>();
    public Usuario? UsuarioComercio { get; set; }
}

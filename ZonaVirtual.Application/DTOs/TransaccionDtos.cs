namespace ZonaVirtual.Application.DTOs;

public record TransaccionDto(
    int Id,
    int Codigo,
    int MedioPago,
    string MedioPagoDescripcion,
    int Estado,
    string EstadoDescripcion,
    decimal Total,
    DateTime Fecha,
    string Concepto,
    string? ComercioNombre,
    string? UsuarioNombre,
    string? UsuarioIdentificacion
);

public record CrearTransaccionRequest(
    int MedioPago,
    decimal Total,
    string Concepto,
    int ComercioId
);

public record ModificarTransaccionRequest(
    int MedioPago,
    int Estado,
    decimal Total,
    DateTime Fecha,
    string Concepto
);

public record FiltroTransaccionesRequest(
    DateTime? Fecha,
    int? Codigo,
    string? IdentificacionUsuario
);

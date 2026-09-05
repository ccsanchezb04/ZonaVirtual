namespace ZonaVirtual.Application.DTOs;

public record RegistroRequest(
    string Identificacion,
    string Nombre,
    string Email,
    string Password,
    int Perfil, // 1=Pagador, 2=Comercio
    string? ComercioNombre = null,
    string? ComercioNit = null,
    string? ComercioDireccion = null
);

public record LoginRequest(
    string Identificacion,
    string Password
);

public record AuthResponse(
    string Token,
    int UsuarioId,
    string Nombre,
    int Perfil,
    int? ComercioId
);

public record VerificarUsuarioRequest(string Identificacion);

public record VerificarUsuarioResponse(bool Existe, int Perfil);

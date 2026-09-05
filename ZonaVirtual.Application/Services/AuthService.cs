using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZonaVirtual.Application.DTOs;
using ZonaVirtual.Domain.Entities;
using ZonaVirtual.Domain.Interfaces;

namespace ZonaVirtual.Application.Services;

public class AuthService
{
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly IComercioRepository _comercioRepo;
    private readonly IConfiguration _config;

    public AuthService(IUsuarioRepository usuarioRepo, IComercioRepository comercioRepo, IConfiguration config)
    {
        _usuarioRepo = usuarioRepo;
        _comercioRepo = comercioRepo;
        _config = config;
    }

    public async Task<VerificarUsuarioResponse> VerificarUsuarioAsync(string identificacion)
    {
        var usuario = await _usuarioRepo.GetByIdentificacionAsync(identificacion);
        return new VerificarUsuarioResponse(usuario != null, usuario?.Perfil ?? 0);
    }

    public async Task<AuthResponse?> RegistrarAsync(RegistroRequest request)
    {
        var existente = await _usuarioRepo.GetByIdentificacionAsync(request.Identificacion);
        if (existente != null)
            return null;

        var usuario = new Usuario
        {
            Identificacion = request.Identificacion,
            Nombre = request.Nombre,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            Perfil = request.Perfil
        };

        if (request.Perfil == 2 && !string.IsNullOrWhiteSpace(request.ComercioNombre))
        {
            int codigo;
            do { codigo = Random.Shared.Next(10000, 99999); }
            while (await _comercioRepo.GetByCodigoAsync(codigo) != null);

            var comercio = new Comercio
            {
                Codigo = codigo,
                Nombre = request.ComercioNombre,
                Nit = request.ComercioNit ?? string.Empty,
                Direccion = request.ComercioDireccion ?? string.Empty
            };
            await _comercioRepo.AddAsync(comercio);
            await _comercioRepo.SaveChangesAsync();
            usuario.ComercioId = comercio.Id;
        }

        await _usuarioRepo.AddAsync(usuario);
        await _usuarioRepo.SaveChangesAsync();

        return new AuthResponse(
            GenerarToken(usuario),
            usuario.Id,
            usuario.Nombre,
            usuario.Perfil,
            usuario.ComercioId
        );
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var usuario = await _usuarioRepo.GetByIdentificacionAsync(request.Identificacion);
        if (usuario == null || !VerifyPassword(request.Password, usuario.PasswordHash))
            return null;

        return new AuthResponse(
            GenerarToken(usuario),
            usuario.Id,
            usuario.Nombre,
            usuario.Perfil,
            usuario.ComercioId
        );
    }

    private string GenerarToken(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiracion = DateTime.UtcNow.AddHours(
            double.Parse(_config["JwtSettings:ExpirationHours"] ?? "8"));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Identificacion),
            new Claim("perfil", usuario.Perfil.ToString()),
            new Claim("comercioId", usuario.ComercioId?.ToString() ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: expiracion,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password), salt, 100_000, HashAlgorithmName.SHA256, 32);
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    private static bool VerifyPassword(string password, string stored)
    {
        var parts = stored.Split(':');
        if (parts.Length != 2) return false;
        var salt = Convert.FromBase64String(parts[0]);
        var expectedHash = Convert.FromBase64String(parts[1]);
        var actualHash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password), salt, 100_000, HashAlgorithmName.SHA256, 32);
        return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
    }
}

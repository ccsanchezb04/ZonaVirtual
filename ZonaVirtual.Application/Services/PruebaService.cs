using ZonaVirtual.Domain.Entities;
using ZonaVirtual.Domain.Interfaces;

namespace ZonaVirtual.Application.Services;

public class PruebaService
{
    private readonly IComercioRepository _comercioRepo;
    private readonly IUsuarioRepository _usuarioRepo;
    private readonly ITransaccionRepository _transaccionRepo;
    private static readonly Random _rnd = new();

    private static readonly int[] MediosPago = { 32, 29, 41, 42 };
    private static readonly int[] Estados = { 1, 999, 1000, 1001 };
    private static readonly string[] Conceptos = { "Pago servicio", "Compra online", "Recarga", "Factura", "Cuota", "Abono" };

    public PruebaService(
        IComercioRepository comercioRepo,
        IUsuarioRepository usuarioRepo,
        ITransaccionRepository transaccionRepo)
    {
        _comercioRepo = comercioRepo;
        _usuarioRepo = usuarioRepo;
        _transaccionRepo = transaccionRepo;
    }

    public async Task<string> GenerarDatosAsync(int numComercios = 5, int numUsuarios = 10, int transaccionesPorUsuario = 3)
    {
        var comercios = GenerarComercios(numComercios);
        await _comercioRepo.AddRangeAsync(comercios);
        await _comercioRepo.SaveChangesAsync();

        var usuarios = GenerarUsuarios(numUsuarios);
        await _usuarioRepo.AddRangeAsync(usuarios);
        await _usuarioRepo.SaveChangesAsync();

        var codigosUsados = new HashSet<int>();
        var transacciones = new List<Transaccion>();

        foreach (var usuario in usuarios)
        {
            for (int i = 0; i < transaccionesPorUsuario; i++)
            {
                int codigo;
                do { codigo = _rnd.Next(100000, 999999); }
                while (codigosUsados.Contains(codigo) || await _transaccionRepo.ExistsCodigoAsync(codigo));
                codigosUsados.Add(codigo);

                transacciones.Add(new Transaccion
                {
                    Codigo = codigo,
                    MedioPago = MediosPago[_rnd.Next(MediosPago.Length)],
                    Estado = Estados[_rnd.Next(Estados.Length)],
                    Total = Math.Round((decimal)(_rnd.NextDouble() * 500000 + 1000), 2),
                    Fecha = DateTime.Now.AddDays(-_rnd.Next(0, 365)),
                    Concepto = Conceptos[_rnd.Next(Conceptos.Length)],
                    UsuarioId = usuario.Id,
                    ComercioId = comercios[_rnd.Next(comercios.Count)].Id
                });
            }
        }

        await _transaccionRepo.AddRangeAsync(transacciones);
        await _transaccionRepo.SaveChangesAsync();

        return $"Generados: {comercios.Count} comercios, {usuarios.Count} usuarios, {transacciones.Count} transacciones.";
    }

    private static List<Comercio> GenerarComercios(int cantidad)
    {
        var nombres = new[] { "TiendaMax", "SuperShop", "MegaStore", "ElectroMax", "FashionPlus",
                              "TechWorld", "ComidaExpress", "AutoParts", "HomePlus", "SportZone" };
        var result = new List<Comercio>();
        for (int i = 0; i < cantidad; i++)
        {
            result.Add(new Comercio
            {
                Codigo = _rnd.Next(1000, 9999) + i * 10000,
                Nombre = $"{nombres[i % nombres.Length]}-{i + 1}",
                Nit = $"{_rnd.Next(800000000, 999999999)}-{_rnd.Next(1, 9)}",
                Direccion = $"Calle {_rnd.Next(1, 200)} # {_rnd.Next(1, 99)}-{_rnd.Next(1, 99)}"
            });
        }
        return result;
    }

    private static List<Usuario> GenerarUsuarios(int cantidad)
    {
        var nombres = new[] { "Carlos", "Ana", "Luis", "Maria", "Juan", "Laura", "Pedro", "Sofia", "Jorge", "Diana",
                              "Andres", "Valentina", "Sebastian", "Camila", "Alejandro" };
        var apellidos = new[] { "García", "López", "Martinez", "Rodríguez", "Hernández", "González", "Pérez", "Torres" };
        var result = new List<Usuario>();
        var hash = HashSimple("Test1234!");

        for (int i = 0; i < cantidad; i++)
        {
            var nombre = $"{nombres[i % nombres.Length]} {apellidos[i % apellidos.Length]}";
            var id = $"{_rnd.Next(10000000, 99999999)}{i}";
            result.Add(new Usuario
            {
                Identificacion = id,
                Nombre = nombre,
                Email = $"user{i + 1}_{_rnd.Next(100, 999)}@test.com",
                PasswordHash = hash,
                Perfil = 1 // pagador
            });
        }
        return result;
    }

    public async Task<string> SeedTestUsersAsync()
    {
        const string idPagador = "PAGADOR01";
        const string idComercio = "COMERCIO01";
        const string password = "Test1234!";
        const int codigoComercio = 9999;

        var existePagador = await _usuarioRepo.GetByIdentificacionAsync(idPagador);
        var existeComercio = await _usuarioRepo.GetByIdentificacionAsync(idComercio);
        if (existePagador != null && existeComercio != null)
            return "Los usuarios de prueba ya existen. Pagador: PAGADOR01 | Comercio: COMERCIO01 | Contraseña: Test1234!";

        var hash = HashSimple(password);
        var mensajes = new List<string>();

        if (existePagador == null)
        {
            await _usuarioRepo.AddAsync(new Usuario
            {
                Identificacion = idPagador,
                Nombre = "Carlos Pagador",
                Email = "pagador@test.com",
                PasswordHash = hash,
                Perfil = 1
            });
            await _usuarioRepo.SaveChangesAsync();
            mensajes.Add("Pagador creado");
        }

        if (existeComercio == null)
        {
            var comercio = await _comercioRepo.GetByCodigoAsync(codigoComercio);
            if (comercio == null)
            {
                comercio = new Comercio
                {
                    Codigo = codigoComercio,
                    Nombre = "Comercio Demo",
                    Nit = "900123456-1",
                    Direccion = "Calle 10 # 5-30, Bogotá"
                };
                await _comercioRepo.AddAsync(comercio);
                await _comercioRepo.SaveChangesAsync();
            }

            var usuarioComercio = new Usuario
            {
                Identificacion = idComercio,
                Nombre = "Maria Comercio",
                Email = "comercio@test.com",
                PasswordHash = hash,
                Perfil = 2,
                ComercioId = comercio.Id
            };
            await _usuarioRepo.AddAsync(usuarioComercio);
            await _usuarioRepo.SaveChangesAsync();
            mensajes.Add("Comercio creado");

            // Generar transacciones de prueba entre el pagador y el comercio
            var pagador = await _usuarioRepo.GetByIdentificacionAsync(idPagador);
            if (pagador != null)
            {
                var transacciones = new List<Transaccion>();
                var codigosUsados = new HashSet<int>();
                for (int i = 0; i < 5; i++)
                {
                    int codigo;
                    do { codigo = _rnd.Next(100000, 999999); }
                    while (codigosUsados.Contains(codigo) || await _transaccionRepo.ExistsCodigoAsync(codigo));
                    codigosUsados.Add(codigo);

                    transacciones.Add(new Transaccion
                    {
                        Codigo = codigo,
                        MedioPago = MediosPago[_rnd.Next(MediosPago.Length)],
                        Estado = Estados[_rnd.Next(Estados.Length)],
                        Total = Math.Round((decimal)(_rnd.NextDouble() * 200000 + 10000), 2),
                        Fecha = DateTime.Now.AddDays(-_rnd.Next(1, 60)),
                        Concepto = Conceptos[_rnd.Next(Conceptos.Length)],
                        UsuarioId = pagador.Id,
                        ComercioId = comercio.Id
                    });
                }
                await _transaccionRepo.AddRangeAsync(transacciones);
                await _transaccionRepo.SaveChangesAsync();
                mensajes.Add("5 transacciones de prueba creadas");
            }
        }

        return $"Seed exitoso: {string.Join(", ", mensajes)}. " +
               "Credenciales → Pagador: PAGADOR01 | Comercio: COMERCIO01 | Contraseña: Test1234!";
    }

    private static string HashSimple(string password)
    {
        using var sha = System.Security.Cryptography.SHA256.Create();
        var salt = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);
        var hash = System.Security.Cryptography.Rfc2898DeriveBytes.Pbkdf2(
            System.Text.Encoding.UTF8.GetBytes(password), salt, 100_000,
            System.Security.Cryptography.HashAlgorithmName.SHA256, 32);
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }
}

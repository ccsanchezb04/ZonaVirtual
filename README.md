# ZonaVirtual — Prueba Técnica Senior

Stack: **ASP.NET Core 8 Web API** | **SQL Server** | **Entity Framework Core 8** | **Angular 17**

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| .NET SDK | 8.x |
| SQL Server | Express / Developer 2019+ |
| Node.js | 18+ |
| Angular CLI | 17 (`npm install -g @angular/cli@17`) |

---

## 1. Base de datos

La base de datos se crea automáticamente al levantar la API gracias a `db.Database.Migrate()` en `Program.cs`.

Verifica la cadena de conexión en `ZonaVirtual.API/appsettings.json`:

```json
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=ZonaVirtualDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

Cámbiala si usas SQL Server en otra instancia (e.g. `Server=(localdb)\\mssqllocaldb` para LocalDB).

### Ejecutar migraciones manualmente (si las auto-migraciones fallan)

```bash
dotnet ef database update --project ZonaVirtual.Infrastructure --startup-project ZonaVirtual.API
```

---

## 2. Levantar la API

```bash
cd ZonaVirtual.API
dotnet run
```

Swagger disponible en: **https://localhost:7220/swagger**

---

## 3. Generar datos de prueba

Llama al endpoint desde Swagger o con curl:

```bash
curl -X POST "https://localhost:7220/api/Prueba/GenerarDatos?comercios=5&usuarios=10&transaccionesPorUsuario=3"
```

---

## 4. Levantar el frontend Angular

```bash
cd zona-virtual-frontend
npm install
ng serve
```

Abre: **http://localhost:4200**

---

## Flujo de uso

1. Seleccionar perfil: **Pagador** o **Comercio**
2. Si no tienes cuenta → Registro → Login
3. **Pagador**: ver mis pagos / nuevo pago a cualquier comercio
4. **Comercio**: ver pagos recibidos, filtrar, ver total, editar transacciones no aprobadas

---

## Estructura del proyecto

```
ZonaVirtual/
├── ZonaVirtual.Domain/          Entidades e interfaces
├── ZonaVirtual.Infrastructure/  DbContext, migraciones, repositorios
├── ZonaVirtual.Application/     DTOs y servicios de negocio
├── ZonaVirtual.API/             Controllers, Program.cs
└── zona-virtual-frontend/       App Angular 17
```

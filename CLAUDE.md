# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZonaVirtual is a payment transaction management system. The backend is ASP.NET Core 8 Web API with SQL Server (via EF Core), and the frontend is Angular 17 (standalone components, lazy-loaded). The Angular SPA lives under `zona-virtual-frontend/` and is referenced by the API project as `ClientApp/` for production publishing.

Two user profiles exist:
- **Pagador** (perfil=1): Views their own transactions, creates new ones, browses merchants.
- **Comercio** (perfil=2): Views/filters incoming transactions and modifies non-approved ones.

## Architecture

### Backend Layer Structure

```
ZonaVirtual.Domain/            → Entities + Repository interfaces only (no dependencies)
ZonaVirtual.Application/       → Services + DTOs (depends on Domain)
ZonaVirtual.Infrastructure/    → EF Core DbContext + Repository implementations (depends on Domain)
ZonaVirtual.API/               → Controllers + DI wiring + JWT config (depends on Application)
```

The API project does **not** reference Infrastructure directly; repositories are registered in `Program.cs` using the interfaces from Domain.

### Key Domain Entities

- `Usuario`: Has `Perfil` (1=Pagador, 2=Comercio) and optional `ComercioId` FK — a Comercio user is linked 1-to-1 with a `Comercio` row.
- `Transaccion`: Links a `Usuario` (payer) to a `Comercio`, with `MedioPago` (int ID) and `Estado` (int ID).
- `MedioPago` / `EstadoTransaccion`: Lookup tables seeded at migration time — do not rely on string lookups in the DB; the services hold static dictionaries.

Seeded IDs: MedioPago → 32=Tarjeta de Crédito, 29=PSE, 41=Gana, 42=Caja. EstadoTransaccion → 1=Aprobada, 999=Pendiente, 1000=Rechazada, 1001=Rechazada SR.

Delete behaviors: Usuario→Comercio is SetNull; Transaccion→Usuario and Transaccion→Comercio are both Restrict (cannot delete a user or merchant that has transactions).

### JWT Claims

Token is generated in `AuthService.GenerarToken()`:
- `ClaimTypes.NameIdentifier` → `usuario.Id` (int as string)
- `ClaimTypes.Name` → `usuario.Identificacion`
- `"perfil"` → `usuario.Perfil` (1 or 2)
- `"comercioId"` → `usuario.ComercioId` (empty string if null)

Controllers extract these via `User.FindFirstValue(ClaimTypes.NameIdentifier)` and `User.FindFirstValue("comercioId")`. `ComercioController` returns 403 if `comercioId` parses to 0 (i.e., a Pagador accessed a Comercio endpoint).

### Password Hashing

PBKDF2-SHA256 with 100,000 iterations, 16-byte random salt, stored as `"base64(salt):base64(hash)"`. Verified with `CryptographicOperations.FixedTimeEquals`.

## Development Commands

### Backend

```powershell
# Build all projects
dotnet build

# Run the API (from repo root or API folder)
dotnet run --project ZonaVirtual.API

# Swagger UI: https://localhost:7220/swagger (https profile) or http://localhost:5166/swagger (http profile)

# EF Core migrations (target Infrastructure, startup API)
dotnet ef migrations add <MigrationName> --project ZonaVirtual.Infrastructure --startup-project ZonaVirtual.API
dotnet ef database update --project ZonaVirtual.Infrastructure --startup-project ZonaVirtual.API
```

### Frontend

```powershell
# From zona-virtual-frontend/
npm install
npm start          # Dev server at http://localhost:4200

npm run build      # Production build → dist/zona-virtual-frontend/browser/
ng test            # Karma unit tests
```

The frontend's `environment.ts` points to `https://localhost:7220/api`. Run the API with the `https` profile when developing locally.

### Generate Test Data

```
POST https://localhost:7220/api/Prueba/GenerarDatos?comercios=5&usuarios=10&transaccionesPorUsuario=3
```

No auth required. Idempotent by skipping existing records.

## Adding New Functionality

**New endpoint:**
1. Add DTOs to `ZonaVirtual.Application/DTOs/` if needed.
2. Add method to the relevant service in `ZonaVirtual.Application/Services/`.
3. Add action to the controller in `ZonaVirtual.API/Controllers/` with `[Authorize]` if needed.

**New entity:**
1. Entity class in `ZonaVirtual.Domain/Entities/`.
2. Repository interface in `ZonaVirtual.Domain/Interfaces/`.
3. Repository implementation in `ZonaVirtual.Infrastructure/Repositories/`.
4. `DbSet<>` + `OnModelCreating` config in `AppDbContext`.
5. Register: `builder.Services.AddScoped<IRepo, RepoImpl>();` in `Program.cs`.
6. Create and apply a new EF Core migration.

## Database Connection

Default: `Server=.\SQLEXPRESS;Database=ZonaVirtualDB;Trusted_Connection=True;TrustServerCertificate=True;`

The database is auto-migrated on startup (`db.Database.Migrate()` in `Program.cs`). For LocalDB, change server to `(localdb)\mssqllocaldb`.

## Production Publishing

Running `dotnet publish` on `ZonaVirtual.API` triggers the `PublishRunWebpack` MSBuild target, which runs `npm install && npm run build` inside `zona-virtual-frontend/` and copies the output to `wwwroot/`. In non-Development environments, the API serves the Angular app as static files with SPA fallback.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TransaccionesService, TransaccionDto } from '../../../core/services/transacciones.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-pagos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <header>
        <h2>Mis Pagos — Hola, {{ nombre }}</h2>
        <div>
          <a routerLink="/pagador/nuevo-pago" class="btn-primary">+ Nuevo Pago</a>
          <button class="btn-secondary" (click)="cargar()" [disabled]="loading">↻ Recargar</button>
          <button class="btn-secondary" (click)="logout()">Cerrar sesión</button>
        </div>
      </header>
      <div *ngIf="loading" class="loading">Cargando...</div>
      <div *ngIf="!loading && transacciones.length === 0" class="empty">No tienes pagos registrados.</div>
      <table *ngIf="!loading && transacciones.length > 0">
        <thead>
          <tr>
            <th>Código</th><th>Comercio</th><th>Medio de Pago</th>
            <th>Estado</th><th>Total</th><th>Fecha</th><th>Concepto</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of transacciones">
            <td>{{ t.codigo }}</td>
            <td>{{ t.comercioNombre }}</td>
            <td>{{ t.medioPagoDescripcion }}</td>
            <td><span [class]="'estado estado-' + t.estado">{{ t.estadoDescripcion }}</span></td>
            <td>{{ t.total | currency:'COP':'symbol':'1.0-0' }}</td>
            <td>{{ t.fecha | date:'dd/MM/yyyy' }}</td>
            <td>{{ t.concepto }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page { padding:20px; font-family:sans-serif; max-width:1100px; margin:0 auto; }
    header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    h2 { color:#2c7a4b; }
    table { width:100%; border-collapse:collapse; }
    th,td { border:1px solid #ddd; padding:10px; text-align:left; }
    th { background:#2c7a4b; color:white; }
    tr:nth-child(even) { background:#f9f9f9; }
    .btn-primary { background:#2c7a4b; color:white; padding:8px 16px; border-radius:6px; text-decoration:none; margin-right:10px; }
    .btn-secondary { background:#fff; border:1px solid #ccc; padding:8px 16px; border-radius:6px; cursor:pointer; }
    .loading,.empty { text-align:center; padding:40px; color:#666; }
    .estado { padding:3px 8px; border-radius:12px; font-size:.85rem; font-weight:bold; }
    .estado-1 { background:#d4edda; color:#155724; }
    .estado-999 { background:#fff3cd; color:#856404; }
    .estado-1000 { background:#f8d7da; color:#721c24; }
    .estado-1001 { background:#f8d7da; color:#721c24; }
  `]
})
export class MisPagosComponent implements OnInit {
  transacciones: TransaccionDto[] = [];
  loading = true;
  nombre = '';

  constructor(private svc: TransaccionesService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.nombre = this.auth.getNombre();
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.svc.getMisTransacciones().subscribe({
      next: (data) => { this.transacciones = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransaccionesService, TransaccionDto } from '../../../core/services/transacciones.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-transacciones-comercio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <header>
        <h2>Transacciones Recibidas — {{ nombre }}</h2>
        <button class="btn-secondary" (click)="logout()">Cerrar sesión</button>
      </header>

      <div class="filtros">
        <input type="date" [(ngModel)]="filtros.fecha" placeholder="Fecha" />
        <input type="number" [(ngModel)]="filtros.codigo" placeholder="Código transacción" />
        <input type="text" [(ngModel)]="filtros.identificacionUsuario" placeholder="Identificación usuario" />
        <button (click)="buscar()">Buscar</button>
        <button class="btn-clear" (click)="limpiar()">Limpiar</button>
      </div>

      <div class="total-banner">
        Total acumulado: <strong>{{ totalComercio | currency:'COP':'symbol':'1.0-0' }}</strong>
      </div>

      <div *ngIf="loading" class="loading">Cargando...</div>
      <div *ngIf="!loading && transacciones.length === 0" class="empty">No hay transacciones con esos filtros.</div>

      <table *ngIf="!loading && transacciones.length > 0">
        <thead>
          <tr>
            <th>Código</th><th>Usuario</th><th>Identificación</th>
            <th>Medio de Pago</th><th>Estado</th><th>Total</th><th>Fecha</th><th>Concepto</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of transacciones">
            <td>{{ t.codigo }}</td>
            <td>{{ t.usuarioNombre }}</td>
            <td>{{ t.usuarioIdentificacion }}</td>
            <td>{{ t.medioPagoDescripcion }}</td>
            <td><span [class]="'estado estado-' + t.estado">{{ t.estadoDescripcion }}</span></td>
            <td>{{ t.total | currency:'COP':'symbol':'1.0-0' }}</td>
            <td>{{ t.fecha | date:'dd/MM/yyyy' }}</td>
            <td>{{ t.concepto }}</td>
            <td>
              <button *ngIf="t.estado !== 1" (click)="abrirEdicion(t)" class="btn-edit">Editar</button>
              <span *ngIf="t.estado === 1" class="aprobada-lock">🔒 Aprobada</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="editando" class="modal-overlay">
        <div class="modal">
          <h3>Editar Transacción #{{ formEdicion.codigo }}</h3>
          <label>Medio de Pago</label>
          <select [(ngModel)]="formEdicion.medioPago">
            <option value="32">Tarjeta de Crédito</option>
            <option value="29">PSE</option>
            <option value="41">Gana</option>
            <option value="42">Caja</option>
          </select>
          <label>Estado</label>
          <select [(ngModel)]="formEdicion.estado">
            <option value="1">Aprobada</option>
            <option value="999">Pendiente</option>
            <option value="1000">Rechazada</option>
            <option value="1001">Rechazada SR</option>
          </select>
          <label>Total</label>
          <input type="number" [(ngModel)]="formEdicion.total" />
          <label>Fecha</label>
          <input type="date" [(ngModel)]="formEdicion.fecha" />
          <label>Concepto</label>
          <input type="text" [(ngModel)]="formEdicion.concepto" />
          <p class="error" *ngIf="errorEdicion">{{ errorEdicion }}</p>
          <div class="modal-buttons">
            <button (click)="guardarEdicion()">Guardar</button>
            <button class="btn-cancel" (click)="editando = false">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding:20px; font-family:sans-serif; max-width:1200px; margin:0 auto; }
    header { display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; }
    h2 { color:#2c7a4b; }
    .filtros { display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap; }
    .filtros input,.filtros select { padding:8px; border:1px solid #ccc; border-radius:6px; }
    .filtros button { background:#2c7a4b; color:white; padding:8px 16px; border:none; border-radius:6px; cursor:pointer; }
    .btn-clear { background:#6c757d !important; }
    .total-banner { background:#e8f5e9; padding:10px 16px; border-radius:8px; margin-bottom:15px; font-size:1.1rem; }
    table { width:100%; border-collapse:collapse; }
    th,td { border:1px solid #ddd; padding:9px; text-align:left; font-size:.9rem; }
    th { background:#2c7a4b; color:white; }
    tr:nth-child(even) { background:#f9f9f9; }
    .btn-edit { background:#f0ad4e; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; }
    .aprobada-lock { font-size:.8rem; color:#888; }
    .estado { padding:3px 8px; border-radius:12px; font-size:.8rem; font-weight:bold; }
    .estado-1 { background:#d4edda; color:#155724; }
    .estado-999 { background:#fff3cd; color:#856404; }
    .estado-1000,.estado-1001 { background:#f8d7da; color:#721c24; }
    .loading,.empty { text-align:center; padding:40px; color:#666; }
    .btn-secondary { background:#fff; border:1px solid #ccc; padding:8px 16px; border-radius:6px; cursor:pointer; }
    .modal-overlay { position:fixed; top:0;left:0;right:0;bottom:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
    .modal { background:white; padding:30px; border-radius:12px; min-width:350px; display:flex; flex-direction:column; gap:10px; }
    .modal input,.modal select { padding:8px; border:1px solid #ccc; border-radius:6px; }
    .modal-buttons { display:flex; gap:10px; }
    .modal-buttons button { background:#2c7a4b; color:white; padding:10px 20px; border:none; border-radius:6px; cursor:pointer; }
    .btn-cancel { background:#6c757d !important; }
    .error { color:red; font-size:.9rem; }
  `]
})
export class TransaccionesComercioComponent implements OnInit {
  transacciones: TransaccionDto[] = [];
  totalComercio = 0;
  loading = true;
  nombre = '';
  editando = false;
  errorEdicion = '';
  filtros = { fecha: '', codigo: null as number | null, identificacionUsuario: '' };
  formEdicion: any = {};
  private transaccionEditandoId = 0;

  constructor(private svc: TransaccionesService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.nombre = this.auth.getNombre();
    this.cargarTotal();
    this.buscar();
  }

  buscar(): void {
    this.loading = true;
    this.svc.getTransaccionesComercio({
      fecha: this.filtros.fecha || undefined,
      codigo: this.filtros.codigo || undefined,
      identificacionUsuario: this.filtros.identificacionUsuario || undefined
    }).subscribe({
      next: (data) => { this.transacciones = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  limpiar(): void {
    this.filtros = { fecha: '', codigo: null, identificacionUsuario: '' };
    this.buscar();
  }

  cargarTotal(): void {
    this.svc.getTotalComercio().subscribe({ next: (r) => this.totalComercio = r.total });
  }

  abrirEdicion(t: TransaccionDto): void {
    this.transaccionEditandoId = t.id;
    this.errorEdicion = '';
    this.formEdicion = {
      codigo: t.codigo,
      medioPago: t.medioPago,
      estado: t.estado,
      total: t.total,
      fecha: t.fecha.substring(0, 10),
      concepto: t.concepto
    };
    this.editando = true;
  }

  guardarEdicion(): void {
    const payload = {
      medioPago: Number(this.formEdicion.medioPago),
      estado: Number(this.formEdicion.estado),
      total: Number(this.formEdicion.total),
      fecha: new Date(this.formEdicion.fecha).toISOString(),
      concepto: this.formEdicion.concepto
    };
    this.svc.modificarTransaccion(this.transaccionEditandoId, payload).subscribe({
      next: () => { this.editando = false; this.buscar(); this.cargarTotal(); },
      error: (err) => this.errorEdicion = err.error?.mensaje ?? 'Error al modificar.'
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}

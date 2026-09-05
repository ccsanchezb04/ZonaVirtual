import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransaccionesService, ComercioDto } from '../../../core/services/transacciones.service';

@Component({
  selector: 'app-nuevo-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Nuevo Pago</h2>
      <form (ngSubmit)="onSubmit()">
        <label>Código de Transacción</label>
        <input type="number" [(ngModel)]="form.codigo" name="codigo" required />

        <label>Comercio</label>
        <select [(ngModel)]="form.comercioId" name="comercio" required>
          <option value="">-- Seleccionar comercio --</option>
          <option *ngFor="let c of comercios" [value]="c.id">{{ c.nombre }} ({{ c.nit }})</option>
        </select>

        <label>Medio de Pago</label>
        <select [(ngModel)]="form.medioPago" name="medioPago" required>
          <option value="">-- Seleccionar --</option>
          <option value="32">Tarjeta de Crédito</option>
          <option value="29">PSE</option>
          <option value="41">Gana</option>
          <option value="42">Caja</option>
        </select>

        <label>Estado</label>
        <select [(ngModel)]="form.estado" name="estado" required>
          <option value="">-- Seleccionar --</option>
          <option value="1">Aprobada</option>
          <option value="999">Pendiente</option>
          <option value="1000">Rechazada</option>
          <option value="1001">Rechazada SR</option>
        </select>

        <label>Total</label>
        <input type="number" [(ngModel)]="form.total" name="total" min="0.01" step="0.01" required />

        <label>Fecha</label>
        <input type="date" [(ngModel)]="form.fecha" name="fecha" required />

        <label>Concepto</label>
        <input type="text" [(ngModel)]="form.concepto" name="concepto" required />

        <p class="error" *ngIf="error">{{ error }}</p>
        <p class="success" *ngIf="success">{{ success }}</p>
        <div class="buttons">
          <a routerLink="/pagador/mis-pagos" class="btn-back">Cancelar</a>
          <button type="submit">Guardar Pago</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width:480px; margin:40px auto; font-family:sans-serif; }
    h2 { color:#2c7a4b; }
    form { display:flex; flex-direction:column; gap:10px; margin-top:20px; }
    input,select { padding:10px; border:1px solid #ccc; border-radius:6px; font-size:1rem; }
    button { background:#2c7a4b; color:white; padding:12px; border:none; border-radius:6px; cursor:pointer; font-size:1rem; }
    button:hover { background:#1f5c38; }
    .btn-back { background:#fff; border:1px solid #ccc; padding:10px 16px; border-radius:6px; text-decoration:none; color:#333; }
    .buttons { display:flex; gap:10px; }
    .error { color:red; font-size:.9rem; }
    .success { color:green; font-size:.9rem; }
  `]
})
export class NuevoPagoComponent implements OnInit {
  comercios: ComercioDto[] = [];
  form = { codigo: null as number | null, comercioId: '', medioPago: '', estado: '', total: null as number | null, fecha: '', concepto: '' };
  error = '';
  success = '';

  constructor(private svc: TransaccionesService, private router: Router) {}

  ngOnInit(): void {
    this.svc.getComercios().subscribe({ next: (data) => this.comercios = data });
  }

  onSubmit(): void {
    this.error = '';
    const payload = {
      codigo: Number(this.form.codigo),
      comercioId: Number(this.form.comercioId),
      medioPago: Number(this.form.medioPago),
      estado: Number(this.form.estado),
      total: Number(this.form.total),
      fecha: new Date(this.form.fecha).toISOString(),
      concepto: this.form.concepto
    };
    this.svc.crearTransaccion(payload).subscribe({
      next: () => {
        this.success = 'Pago registrado exitosamente.';
        setTimeout(() => this.router.navigate(['/pagador/mis-pagos']), 1500);
      },
      error: (err) => this.error = err.error?.mensaje ?? 'Error al guardar el pago.'
    });
  }
}

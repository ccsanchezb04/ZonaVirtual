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
      <p class="info">El código y la fecha se asignan automáticamente. El estado inicia en <strong>Pendiente</strong> hasta que el comercio lo gestione.</p>

      <form (ngSubmit)="onSubmit()">
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

        <label>Total</label>
        <input type="number" [(ngModel)]="form.total" name="total" min="0.01" step="0.01" required placeholder="0.00" />

        <label>Concepto</label>
        <input type="text" [(ngModel)]="form.concepto" name="concepto" required placeholder="Descripción del pago" />

        <p class="error" *ngIf="error">{{ error }}</p>
        <p class="success" *ngIf="success">{{ success }}</p>

        <div class="buttons">
          <a routerLink="/pagador/mis-pagos" class="btn-back">Cancelar</a>
          <button type="submit" [disabled]="cargando">{{ cargando ? 'Guardando...' : 'Registrar Pago' }}</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width:480px; margin:40px auto; font-family:sans-serif; }
    h2 { color:#2c7a4b; }
    .info { background:#f0f9f4; border-left:3px solid #2c7a4b; padding:10px 14px; border-radius:4px; font-size:.9rem; color:#444; margin-bottom:16px; }
    form { display:flex; flex-direction:column; gap:12px; margin-top:20px; }
    label { font-size:.85rem; font-weight:600; color:#444; }
    input, select { padding:10px; border:1.5px solid #ddd; border-radius:6px; font-size:1rem; outline:none; }
    input:focus, select:focus { border-color:#2c7a4b; }
    button { background:#2c7a4b; color:white; padding:12px; border:none; border-radius:6px; cursor:pointer; font-size:1rem; font-weight:600; }
    button:hover:not(:disabled) { background:#1f5c38; }
    button:disabled { opacity:.6; cursor:not-allowed; }
    .btn-back { background:#fff; border:1.5px solid #ddd; padding:11px 16px; border-radius:6px; text-decoration:none; color:#333; font-size:1rem; }
    .buttons { display:flex; gap:10px; }
    .error { color:#c0392b; font-size:.9rem; margin:0; }
    .success { color:#2c7a4b; font-size:.9rem; margin:0; }
  `]
})
export class NuevoPagoComponent implements OnInit {
  comercios: ComercioDto[] = [];
  form = { comercioId: '', medioPago: '', total: null as number | null, concepto: '' };
  error = '';
  success = '';
  cargando = false;

  constructor(private svc: TransaccionesService, private router: Router) {}

  ngOnInit(): void {
    this.svc.getComercios().subscribe({ next: (data) => this.comercios = data });
  }

  onSubmit(): void {
    this.error = '';
    this.cargando = true;
    const payload = {
      comercioId: Number(this.form.comercioId),
      medioPago: Number(this.form.medioPago),
      total: Number(this.form.total),
      concepto: this.form.concepto
    };
    this.svc.crearTransaccion(payload).subscribe({
      next: () => {
        this.success = 'Pago registrado. Estado: Pendiente.';
        setTimeout(() => this.router.navigate(['/pagador/mis-pagos']), 1500);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.mensaje ?? 'Error al guardar el pago.';
      }
    });
  }
}

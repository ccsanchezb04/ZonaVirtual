import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seleccion-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Bienvenido a ZonaPagos</h2>
      <p>Selecciona tu tipo de perfil:</p>
      <div class="perfil-cards">
        <div class="card" (click)="seleccionarPerfil(1)">
          <span class="icon">👤</span>
          <h3>Pagador</h3>
          <p>Realiza pagos a comercios</p>
        </div>
        <div class="card" (click)="seleccionarPerfil(2)">
          <span class="icon">🏪</span>
          <h3>Comercio</h3>
          <p>Consulta pagos recibidos</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width:500px; margin:80px auto; text-align:center; font-family:sans-serif; }
    h2 { color:#2c7a4b; }
    .perfil-cards { display:flex; gap:20px; justify-content:center; margin-top:30px; }
    .card { border:2px solid #2c7a4b; border-radius:12px; padding:30px 40px; cursor:pointer; transition:all .2s; }
    .card:hover { background:#2c7a4b; color:white; transform:scale(1.05); }
    .icon { font-size:2.5rem; }
  `]
})
export class SeleccionPerfilComponent {
  identificacion = '';
  perfilSeleccionado = 0;

  constructor(private router: Router, private auth: AuthService) {}

  seleccionarPerfil(perfil: number): void {
    this.router.navigate(['/auth/login'], { queryParams: { perfil } });
  }
}

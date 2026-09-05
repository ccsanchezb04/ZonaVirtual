import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Ingresar</h2>
      <p class="perfil-badge">{{ perfil === 1 ? '👤 Pagador' : '🏪 Comercio' }}</p>
      <form (ngSubmit)="onLogin()">
        <label>Identificación</label>
        <input type="text" [(ngModel)]="identificacion" name="id" required />
        <label>Contraseña</label>
        <input type="password" [(ngModel)]="password" name="pass" required />
        <p class="error" *ngIf="error">{{ error }}</p>
        <button type="submit">Ingresar</button>
      </form>
      <p>¿No tienes cuenta? <a [routerLink]="['/auth/registro']" [queryParams]="{perfil: perfil}">Regístrate</a></p>
      <p><a routerLink="/auth">Cambiar perfil</a></p>
    </div>
  `,
  styles: [`
    .container { max-width:360px; margin:60px auto; font-family:sans-serif; }
    h2 { color:#2c7a4b; }
    .perfil-badge { background:#e8f5e9; padding:5px 12px; border-radius:20px; display:inline-block; }
    form { display:flex; flex-direction:column; gap:10px; margin-top:20px; }
    input { padding:10px; border:1px solid #ccc; border-radius:6px; font-size:1rem; }
    button { background:#2c7a4b; color:white; padding:12px; border:none; border-radius:6px; cursor:pointer; font-size:1rem; }
    button:hover { background:#1f5c38; }
    .error { color:red; font-size:.9rem; }
    a { color:#2c7a4b; }
  `]
})
export class LoginComponent implements OnInit {
  identificacion = '';
  password = '';
  perfil = 1;
  error = '';

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.perfil = parseInt(this.route.snapshot.queryParamMap.get('perfil') ?? '1');
  }

  onLogin(): void {
    this.error = '';
    this.auth.login(this.identificacion, this.password).subscribe({
      next: (res) => {
        if (res.perfil === 1) this.router.navigate(['/pagador/mis-pagos']);
        else this.router.navigate(['/comercio/transacciones']);
      },
      error: () => this.error = 'Credenciales inválidas. Verifique e intente nuevamente.'
    });
  }
}

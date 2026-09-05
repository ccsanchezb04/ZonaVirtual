import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Crear cuenta</h2>
      <p class="perfil-badge">{{ perfil === 1 ? '👤 Pagador' : '🏪 Comercio' }}</p>
      <form (ngSubmit)="onRegistro()">
        <label>Identificación</label>
        <input type="text" [(ngModel)]="form.identificacion" name="id" required />
        <label>Nombre completo</label>
        <input type="text" [(ngModel)]="form.nombre" name="nombre" required />
        <label>Email</label>
        <input type="email" [(ngModel)]="form.email" name="email" required />
        <label>Contraseña</label>
        <input type="password" [(ngModel)]="form.password" name="pass" required minlength="6" />
        <p class="error" *ngIf="error">{{ error }}</p>
        <p class="success" *ngIf="success">{{ success }}</p>
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a [routerLink]="['/auth/login']" [queryParams]="{perfil: perfil}">Ingresar</a></p>
    </div>
  `,
  styles: [`
    .container { max-width:380px; margin:50px auto; font-family:sans-serif; }
    h2 { color:#2c7a4b; }
    .perfil-badge { background:#e8f5e9; padding:5px 12px; border-radius:20px; display:inline-block; }
    form { display:flex; flex-direction:column; gap:10px; margin-top:20px; }
    input { padding:10px; border:1px solid #ccc; border-radius:6px; font-size:1rem; }
    button { background:#2c7a4b; color:white; padding:12px; border:none; border-radius:6px; cursor:pointer; font-size:1rem; }
    button:hover { background:#1f5c38; }
    .error { color:red; font-size:.9rem; }
    .success { color:green; font-size:.9rem; }
    a { color:#2c7a4b; }
  `]
})
export class RegistroComponent implements OnInit {
  form = { identificacion: '', nombre: '', email: '', password: '' };
  perfil = 1;
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.perfil = parseInt(this.route.snapshot.queryParamMap.get('perfil') ?? '1');
  }

  onRegistro(): void {
    this.error = '';
    this.auth.registro({ ...this.form, perfil: this.perfil }).subscribe({
      next: () => {
        this.success = 'Cuenta creada. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/auth/login'], { queryParams: { perfil: this.perfil } }), 1500);
      },
      error: (err) => this.error = err.error?.mensaje ?? 'Error al registrar.'
    });
  }
}

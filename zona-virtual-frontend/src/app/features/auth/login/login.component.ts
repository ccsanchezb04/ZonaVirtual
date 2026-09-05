import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <div class="logo">ZonaPagos</div>

        <div class="tabs">
          <button [class.active]="modo === 'login'" (click)="cambiarModo('login')">Iniciar sesión</button>
          <button [class.active]="modo === 'registro'" (click)="cambiarModo('registro')">Registrarse</button>
        </div>

        <!-- LOGIN -->
        <form *ngIf="modo === 'login'" (ngSubmit)="onLogin()" class="form">
          <div class="field">
            <label>Identificación</label>
            <input type="text" [(ngModel)]="login.identificacion" name="lid" required placeholder="Número de identificación" />
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input type="password" [(ngModel)]="login.password" name="lpass" required placeholder="••••••••" />
          </div>
          <p class="error" *ngIf="error">{{ error }}</p>
          <button type="submit" [disabled]="cargando" class="btn-primary">
            {{ cargando ? 'Ingresando...' : 'Ingresar' }}
          </button>
          <p class="hint">El sistema detecta automáticamente tu tipo de cuenta.</p>
        </form>

        <!-- REGISTRO -->
        <form *ngIf="modo === 'registro'" (ngSubmit)="onRegistro()" class="form">
          <div class="field">
            <label>Tipo de cuenta</label>
            <div class="perfil-opts">
              <label class="opt" [class.selected]="reg.perfil === 1">
                <input type="radio" name="perfil" [value]="1" [(ngModel)]="reg.perfil" /> Pagador
              </label>
              <label class="opt" [class.selected]="reg.perfil === 2">
                <input type="radio" name="perfil" [value]="2" [(ngModel)]="reg.perfil" /> Comercio
              </label>
            </div>
          </div>
          <div class="field">
            <label>Identificación</label>
            <input type="text" [(ngModel)]="reg.identificacion" name="rid" required placeholder="Número de identificación" />
          </div>
          <div class="field">
            <label>Nombre completo</label>
            <input type="text" [(ngModel)]="reg.nombre" name="rnombre" required placeholder="Tu nombre" />
          </div>
          <div class="field">
            <label>Email</label>
            <input type="email" [(ngModel)]="reg.email" name="remail" required placeholder="correo@ejemplo.com" />
          </div>
          <div class="field">
            <label>Contraseña</label>
            <input type="password" [(ngModel)]="reg.password" name="rpass" required minlength="6" placeholder="Mínimo 6 caracteres" />
          </div>

          <ng-container *ngIf="reg.perfil === 2">
            <div class="sep">Datos del comercio</div>
            <div class="field">
              <label>Nombre del comercio</label>
              <input type="text" [(ngModel)]="reg.comercioNombre" name="cnombre" required placeholder="Nombre de tu negocio" />
            </div>
            <div class="field">
              <label>NIT</label>
              <input type="text" [(ngModel)]="reg.comercioNit" name="cnit" required placeholder="900123456-1" />
            </div>
            <div class="field">
              <label>Dirección</label>
              <input type="text" [(ngModel)]="reg.comercioDireccion" name="cdir" placeholder="Dirección del comercio" />
            </div>
          </ng-container>

          <p class="error" *ngIf="error">{{ error }}</p>
          <p class="success" *ngIf="success">{{ success }}</p>
          <button type="submit" [disabled]="cargando" class="btn-primary">
            {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f4f1;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 40px 36px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 24px rgba(0,0,0,.08);
    }
    .logo {
      font-size: 1.6rem;
      font-weight: 700;
      color: #2c7a4b;
      text-align: center;
      margin-bottom: 28px;
      letter-spacing: -.5px;
    }
    .tabs {
      display: flex;
      border-bottom: 2px solid #e8e8e8;
      margin-bottom: 28px;
    }
    .tabs button {
      flex: 1;
      background: none;
      border: none;
      padding: 10px;
      font-size: .95rem;
      cursor: pointer;
      color: #888;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all .2s;
    }
    .tabs button.active {
      color: #2c7a4b;
      border-bottom-color: #2c7a4b;
      font-weight: 600;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-size: .85rem;
      font-weight: 600;
      color: #444;
    }
    input[type=text], input[type=password], input[type=email] {
      padding: 10px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: .95rem;
      transition: border-color .2s;
      outline: none;
    }
    input:focus {
      border-color: #2c7a4b;
    }
    .btn-primary {
      background: #2c7a4b;
      color: white;
      border: none;
      padding: 13px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 4px;
      transition: background .2s;
    }
    .btn-primary:hover:not(:disabled) { background: #1f5c38; }
    .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
    .error { color: #c0392b; font-size: .88rem; margin: 0; }
    .success { color: #2c7a4b; font-size: .88rem; margin: 0; }
    .hint { text-align: center; font-size: .82rem; color: #aaa; margin: 0; }
    .perfil-opts {
      display: flex;
      gap: 12px;
    }
    .opt {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      font-size: .95rem;
      font-weight: 500;
      transition: all .2s;
    }
    .opt.selected {
      border-color: #2c7a4b;
      background: #f0f9f4;
      color: #2c7a4b;
    }
    .opt input { display: none; }
    .sep {
      font-size: .8rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #999;
      letter-spacing: .5px;
      border-top: 1px solid #eee;
      padding-top: 12px;
    }
  `]
})
export class LoginComponent {
  modo: 'login' | 'registro' = 'login';
  cargando = false;
  error = '';
  success = '';

  login = { identificacion: '', password: '' };

  reg = {
    identificacion: '',
    nombre: '',
    email: '',
    password: '',
    perfil: 1,
    comercioNombre: '',
    comercioNit: '',
    comercioDireccion: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  cambiarModo(m: 'login' | 'registro'): void {
    this.modo = m;
    this.error = '';
    this.success = '';
  }

  onLogin(): void {
    this.error = '';
    this.cargando = true;
    this.auth.login(this.login.identificacion, this.login.password).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.perfil === 1) this.router.navigate(['/pagador/mis-pagos']);
        else this.router.navigate(['/comercio/transacciones']);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Credenciales inválidas. Verifica tu identificación y contraseña.';
      }
    });
  }

  onRegistro(): void {
    this.error = '';
    this.success = '';
    this.cargando = true;

    const payload: any = {
      identificacion: this.reg.identificacion,
      nombre: this.reg.nombre,
      email: this.reg.email,
      password: this.reg.password,
      perfil: this.reg.perfil
    };

    if (this.reg.perfil === 2) {
      payload.comercioNombre = this.reg.comercioNombre;
      payload.comercioNit = this.reg.comercioNit;
      payload.comercioDireccion = this.reg.comercioDireccion;
    }

    this.auth.registro(payload).subscribe({
      next: (res) => {
        this.cargando = false;
        this.auth.guardarSesion(res);
        if (res.perfil === 1) this.router.navigate(['/pagador/mis-pagos']);
        else this.router.navigate(['/comercio/transacciones']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.status === 409
          ? 'Ya existe una cuenta con esa identificación.'
          : 'Error al crear la cuenta. Intenta de nuevo.';
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  usuarioId: number;
  nombre: string;
  perfil: number;
  comercioId: number | null;
}

export interface VerificarResponse {
  existe: boolean;
  perfil: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  verificar(identificacion: string): Observable<VerificarResponse> {
    return this.http.post<VerificarResponse>(`${this.api}/Auth/Verificar`, { identificacion });
  }

  registro(data: { identificacion: string; nombre: string; email: string; password: string; perfil: number }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/Auth/Registro`, data);
  }

  login(identificacion: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/Auth/Login`, { identificacion, password })
      .pipe(tap(res => this.guardarSesion(res)));
  }

  guardarSesion(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('perfil', res.perfil.toString());
    localStorage.setItem('nombre', res.nombre);
    localStorage.setItem('usuarioId', res.usuarioId.toString());
    if (res.comercioId) localStorage.setItem('comercioId', res.comercioId.toString());
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getPerfil(): number { return parseInt(localStorage.getItem('perfil') ?? '0'); }
  getNombre(): string { return localStorage.getItem('nombre') ?? ''; }
  isLoggedIn(): boolean { return !!this.getToken(); }

  logout(): void {
    localStorage.clear();
  }
}

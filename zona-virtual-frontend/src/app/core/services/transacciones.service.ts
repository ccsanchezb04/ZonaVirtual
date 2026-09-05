import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TransaccionDto {
  id: number;
  codigo: number;
  medioPago: number;
  medioPagoDescripcion: string;
  estado: number;
  estadoDescripcion: string;
  total: number;
  fecha: string;
  concepto: string;
  comercioNombre: string;
  usuarioNombre: string;
  usuarioIdentificacion: string;
}

export interface ComercioDto {
  id: number;
  codigo: number;
  nombre: string;
  nit: string;
  direccion: string;
}

@Injectable({ providedIn: 'root' })
export class TransaccionesService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComercios(): Observable<ComercioDto[]> {
    return this.http.get<ComercioDto[]>(`${this.api}/Pagador/Comercios`);
  }

  getMisTransacciones(): Observable<TransaccionDto[]> {
    return this.http.get<TransaccionDto[]>(`${this.api}/Pagador/Transacciones`);
  }

  crearTransaccion(data: any): Observable<TransaccionDto> {
    return this.http.post<TransaccionDto>(`${this.api}/Pagador/Transacciones`, data);
  }

  getTransaccionesComercio(filtros: { fecha?: string; codigo?: number; identificacionUsuario?: string }): Observable<TransaccionDto[]> {
    let params = new HttpParams();
    if (filtros.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros.codigo) params = params.set('codigo', filtros.codigo.toString());
    if (filtros.identificacionUsuario) params = params.set('identificacionUsuario', filtros.identificacionUsuario);
    return this.http.get<TransaccionDto[]>(`${this.api}/Comercio/Transacciones`, { params });
  }

  getTotalComercio(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.api}/Comercio/TotalTransacciones`);
  }

  modificarTransaccion(id: number, data: any): Observable<any> {
    return this.http.put(`${this.api}/Comercio/Transacciones/${id}`, data);
  }
}

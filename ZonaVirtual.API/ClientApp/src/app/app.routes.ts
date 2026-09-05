import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      { path: '', loadComponent: () => import('./features/auth/seleccion-perfil/seleccion-perfil.component').then(m => m.SeleccionPerfilComponent) },
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'registro', loadComponent: () => import('./features/auth/registro/registro.component').then(m => m.RegistroComponent) },
    ]
  },
  {
    path: 'pagador',
    canActivate: [authGuard],
    children: [
      { path: 'mis-pagos', loadComponent: () => import('./features/pagador/mis-pagos/mis-pagos.component').then(m => m.MisPagosComponent) },
      { path: 'nuevo-pago', loadComponent: () => import('./features/pagador/nuevo-pago/nuevo-pago.component').then(m => m.NuevoPagoComponent) },
    ]
  },
  {
    path: 'comercio',
    canActivate: [authGuard],
    children: [
      { path: 'transacciones', loadComponent: () => import('./features/comercio/transacciones/transacciones.component').then(m => m.TransaccionesComercioComponent) },
    ]
  },
  { path: '**', redirectTo: '/auth' }
];

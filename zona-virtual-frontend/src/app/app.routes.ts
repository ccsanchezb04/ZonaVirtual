import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
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

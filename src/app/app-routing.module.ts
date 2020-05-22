import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) }, 
  { path: 'profile', loadChildren: () => import('./components/pages/profile/profile.module').then(m => m.ProfileModule) }, 
  { path: 'delivery', loadChildren: () => import('./components/pages/pedidos-delivery/pedidos-delivery.module').then(m => m.PedidosDeliveryModule) }, 
  { path: 'deposito', loadChildren: () => import('./components/pages/pedidos-deposito/pedidos-deposito.module').then(m => m.PedidosDepositoModule) }, 
  { path: 'ingresos', loadChildren: () => import('./components/pages/otros-ingresos/otros-ingresos.module').then(m => m.OtrosIngresosModule) }, 
  { path: 'movimientos', loadChildren: () => import('./components/pages/movimientos/movimientos.module').then(m => m.MovimientosModule) }, 
  { path: 'clientes', loadChildren: () => import('./components/pages/clientes/clientes.module').then(m => m.ClientesModule) },
  { path: 'rep_mov', loadChildren: () => import('./components/pages/rep-mov/rep-mov.module').then(m => m.RepMovModule) },
  { path: 'contratos', loadChildren: () => import('./components/pages/contratos/contratos.module').then(m => m.ContratosModule) },
  { path: 'mapa', loadChildren: () => import('./components/pages/mapa/mapa.module').then(m => m.MapaModule) },
  
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

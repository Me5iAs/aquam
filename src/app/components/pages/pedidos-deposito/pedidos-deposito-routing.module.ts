import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosDepositoComponent } from './pedidos-deposito.component';

const routes: Routes = [{ path: '', component: PedidosDepositoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosDepositoRoutingModule { }

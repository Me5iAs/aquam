import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosDeliveryComponent } from './pedidos-delivery.component';

const routes: Routes = [{ path: '', component: PedidosDeliveryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosDeliveryRoutingModule { }

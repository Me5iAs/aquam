import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosDeliveryRoutingModule } from './pedidos-delivery-routing.module';
import { PedidosDeliveryComponent } from './pedidos-delivery.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [PedidosDeliveryComponent],
  exports:[
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    PedidosDeliveryRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PedidosDeliveryModule { }

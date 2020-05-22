import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosDepositoRoutingModule } from './pedidos-deposito-routing.module';
import { PedidosDepositoComponent } from './pedidos-deposito.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";

@NgModule({
  declarations: [PedidosDepositoComponent],
  exports:[
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    PedidosDepositoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PedidosDepositoModule { }

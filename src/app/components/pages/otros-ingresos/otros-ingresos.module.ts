import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtrosIngresosRoutingModule } from './otros-ingresos-routing.module';
import { OtrosIngresosComponent } from './otros-ingresos.component';


@NgModule({
  declarations: [OtrosIngresosComponent],
  imports: [
    CommonModule,
    OtrosIngresosRoutingModule
  ]
})
export class OtrosIngresosModule { }

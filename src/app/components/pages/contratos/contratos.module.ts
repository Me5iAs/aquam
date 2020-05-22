import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratosRoutingModule } from './contratos-routing.module';
import { ContratosComponent } from './contratos.component';
import {MaterialModule} from "../../../material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {GTablaComponent} from "../../shared/g-tabla/g-tabla.component"

@NgModule({
  declarations: [ContratosComponent, GTablaComponent
  ],
  imports: [
    CommonModule,
    ContratosRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    ReactiveFormsModule
  ]
})
export class ContratosModule { }

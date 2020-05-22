import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepMovRoutingModule } from './rep-mov-routing.module';
import { RepMovComponent, DialogMovRep } from './rep-mov.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import {MaterialModule} from "../../../material.module";


@NgModule({
  declarations: [RepMovComponent, DialogMovRep],
  exports:[
    ReactiveFormsModule
  ],
  // entryComponents: [
  //   DialogMovRep
  // ],
  imports: [
    CommonModule,
    RepMovRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})


export class RepMovModule { }

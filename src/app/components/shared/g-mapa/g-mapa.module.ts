import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GMapaComponent } from './g-mapa.component';
import { GoogleMapsModule } from "@angular/google-maps";

@NgModule({
  declarations: [GMapaComponent],
  imports: [
    CommonModule,GoogleMapsModule
    
  ],
  exports:[
    GMapaComponent
  ]
})
export class GMapaModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from "../../../material.module";
import { MapaRoutingModule } from './mapa-routing.module';
import { MapaComponent } from './mapa.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
// import {GMapaComponent} from "../../shared/g-mapa/g-mapa.component"
import {GMapaModule} from "../../shared/g-mapa/g-mapa.module"

@NgModule({
  declarations: [
    MapaComponent, 
    // GMapaComponent
  ],
  imports: [
    CommonModule,
    MapaRoutingModule,
    GoogleMapsModule, 
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    GMapaModule
    // GmapaModule
  ],
  exports:[
    ReactiveFormsModule,
  ]
})
export class MapaModule { }

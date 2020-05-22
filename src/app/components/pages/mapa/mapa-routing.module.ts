import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaComponent } from './mapa.component';

const routes: Routes = [{ path: '', component: MapaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapaRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepMovComponent } from './rep-mov.component';

const routes: Routes = [{ path: '', component: RepMovComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepMovRoutingModule { }

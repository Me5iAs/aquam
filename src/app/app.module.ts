import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

// guardianes
import { AuthGuard } from "./guards/auth.guard";
import { NoauthGuard } from './guards/noauth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ContainerComponent } from './components/container/container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { HomeComponent } from './components/pages/home/home.component';
import {MapaComponent} from "./components/pages/mapa/mapa.component"
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { GDialogComponent } from './components/shared/g-dialog/g-dialog.component';
import { GBuscarComponent } from './components/shared/g-buscar/g-buscar.component';
import { GInputComponent } from './components/shared/g-input/g-input.component';
import { GTablaComponent } from './components/shared/g-tabla/g-tabla.component';
import { GMostrarComponent } from './components/shared/g-mostrar/g-mostrar.component';
// import {GMapaComponent} from "./components/shared/g-mapa/g-mapa.component"
// import {GmapaComponent} from "./components/shared/gmapa/gmapa.component"

// google
// import { GoogleMapsModule } from "@angular/google-maps";


// crear componentes: ng g m components/pages/contratos -m=app --route=contratos
// además debe actualizarse en la constante routes el nuevo componente

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[NoauthGuard]},
  { path: '', component: ContainerComponent,canActivate:[AuthGuard], children:[
    {path: 'home',loadChildren: () =>import("./components/pages/home/home.module").then(m => m.HomeModule)},
    {path: 'profile',loadChildren: () =>import("./components/pages/profile/profile.module").then(m => m.ProfileModule)},
    {path: 'delivery',loadChildren: () =>import("./components/pages/pedidos-delivery/pedidos-delivery.module").then(m => m.PedidosDeliveryModule)},
    {path: 'deposito',loadChildren: () =>import("./components/pages/pedidos-deposito/pedidos-deposito.module").then(m => m.PedidosDepositoModule)},
    {path: 'movimientos',loadChildren: () =>import("./components/pages/movimientos/movimientos.module").then(m => m.MovimientosModule)},
    {path: 'ingresos',loadChildren: () =>import("./components/pages/otros-ingresos/otros-ingresos.module").then(m => m.OtrosIngresosModule)},
    {path: 'clientes',loadChildren: () =>import("./components/pages/clientes/clientes.module").then(m => m.ClientesModule)},
    {path: 'rep_mov',loadChildren: () =>import("./components/pages/rep-mov/rep-mov.module").then(m => m.RepMovModule)},
    {path: 'contratos',loadChildren: () =>import("./components/pages/contratos/contratos.module").then(m => m.ContratosModule)},
    {path: 'mapa',loadChildren: () =>import("./components/pages/mapa/mapa.module").then(m => m.MapaModule)},
    {path:"", redirectTo:"home", pathMatch:"full"}
  ] },
  { path: '*', redirectTo: '/', pathMatch: 'full' },


];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContainerComponent,
    ToolbarComponent,
    GDialogComponent,
    GBuscarComponent,
    GInputComponent,
    GMostrarComponent,
    // GMapaComponent  
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    // GoogleMapsModule,
    // GmapaComponent
  ],
  exports:[
    ReactiveFormsModule,
    
  ],
  // entryComponents:[
  //   GDialogComponent,
  //   GBuscarComponent,
  //   GInputComponent,
  //   GMostrarComponent
  // ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

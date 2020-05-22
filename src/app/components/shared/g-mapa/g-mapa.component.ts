import { Component, OnInit, ViewChild, Input, Output, Inject, EventEmitter } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormGroup, FormControl, Validators} from "@angular/forms"; 
import {GInputComponent} from "../../shared/g-input/g-input.component";
import {inputI} from "../../../models/input.interface";

@Component({
  selector: 'g-mapa',
  templateUrl: './g-mapa.component.html',
  styleUrls: ['./g-mapa.component.styl']
})
export class GMapaComponent implements OnInit {

  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapInfoWindow) info: MapInfoWindow;

  @Input() Marcadores: any[] = [];
  @Input() Multimarcadores: boolean = true;
  @Input() Alto: string="300";
  @Output() MarcadoresChange = new EventEmitter<any[]>();
   /* imput Marcadores debe tener esta estructura:
   Marcadores = [
     {
       position: {
         lat : latitud (en numeros),
         lng: longitud (en numeros),
       },
       label: {
         text: "direccion",
       },
       title: "referencia",
       options: {
         animation: google.maps.Animation.DROP,
       },
     }
   ] */

  public input:inputI;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    mapTypeControl: false,
    disableDoubleClickZoom: true,
    // mapTypeId: 'hybrid',
    // maxZoom: 15,
    minZoom: 8,
    streetViewControl: false
  };
  markers = [];
  Direccion: string="";
  Referencia: string ="";
  center;
  zoom = 16; //14

  constructor(public dialog: MatDialog) { }

 
  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      if(this.Marcadores.length==0){
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      }else{
        this.center = this.Marcadores[0].position
      }
      
    });

    this.markers = this.Marcadores;
  }

  click(event: google.maps.MouseEvent){
    if(!confirm("¿Desea agregar un nuevo marcador?")){
      return;
    }

    this.input = <inputI> {
      Titulo : "Dirección",
      Campos: [
         {Nombre: "Direccion",Tipo:"Texto",Etiqueta:"Direccion",Valor: "", Validacion:[Validators.required]},
         {Nombre: "Referencia",Tipo:"Texto",Etiqueta:"Referencia",Valor: "", Validacion:[Validators.required]},
      ]
    }
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '300px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if (this.Multimarcadores == false){
            this.markers = [];
        }
        this.markers.push({
          position: {
            lat : event.latLng.lat(),
            lng: event.latLng.lng(),
          },
          label: {
            text: result.Direccion,
          },
          title: result.Referencia,
          options: {
            animation: google.maps.Animation.DROP,
          },
        });
        this.MarcadoresChange.emit(this.markers);
      }
    })
  }
 
   isMobile(){
    return (
      (navigator.userAgent.match(/Android/i)) ||
      (navigator.userAgent.match(/webOS/i)) ||
      (navigator.userAgent.match(/iPhone/i)) ||
      (navigator.userAgent.match(/iPod/i)) ||
      (navigator.userAgent.match(/iPad/i)) ||
      (navigator.userAgent.match(/BlackBerry/i))
    );
  }

  mousein(marker: MapMarker, content){
    if(this.isMobile()){
      return;
    }else{
      this.openInfo(marker, content);
    }
  }
  mouseout(){
    if(this.isMobile()){
      return;
    }else{
      this.closeInfo();
    }
  }

  mobileclick(marker: MapMarker, content){
    if(this.isMobile()){
      this.openInfo(marker, content);
    }else{
     return;
    }
  }
  
  openInfo(marker: MapMarker, content) {
    this.Direccion = content.label.text;
    this.Referencia = content.title;
    this.info.open(marker);
  }

  closeInfo() {
    this.info.close();
  }

}

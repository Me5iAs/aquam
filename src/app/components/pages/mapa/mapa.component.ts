import { Component, OnInit, ViewChild } from '@angular/core';
// import {GMapaComponent} from "../../shared/g-mapa/g-mapa.component";

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.styl']
})
export class MapaComponent implements OnInit {

  // @ViewChild(gMapa GMapaComponent: GMapaComponent;

  Marcadores =[];
  // Marcadores = [
  //   {
  //     position: {
  //       lat : -3.749425,
  //       lng: -73.244345,
  //     },
  //     label: {
  //       text: "Participación 10 H17",
  //     },
  //     title: "Detrás del Gorel",
  //     options: {
  //       animation: google.maps.Animation.DROP,
  //     },
  //   }
  // ]
  constructor() { }

  onMarcadores($event){
    console.log($event);   
    var ua = navigator.userAgent;
		console.log(ua); 
  }
  ngOnInit() {}

}

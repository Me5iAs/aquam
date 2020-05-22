import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { PedidoI } from "../../../models/pedido.interface";
import Swal from 'sweetalert2'
import {gQueryService} from "./../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";

@Component({
  selector: 'app-pedidos-delivery',
  templateUrl: './pedidos-delivery.component.html',
  styleUrls: ['./pedidos-delivery.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class PedidosDeliveryComponent implements OnInit {

public Clientes:any;
public Botellones: any;
Cancelado = true;

  constructor(private gQuery:gQueryService, private router:Router) { }
  PedidoForm = new FormGroup({
    IdCliente: new FormControl("",Validators.required),
    
    Precio: new FormControl(3.00,Validators.required),
    BotVendidos: new FormControl(1,Validators.required),
    BotNewPrestado: new FormControl(0, Validators.required),
    BotOldPrestado: new FormControl(0, Validators.required),
    Fecha: new FormControl(new Date(), Validators.required),
  });
  ngOnInit() {
    this.gQuery.sql("sp_clientes_devolver").subscribe(r=>{
      this.Clientes = r;
    })
    this.Botellones = [
      {Cant: 0, Text: "Ninguno"},
      {Cant: 1, Text: "01 Botellón"},
      {Cant: 2, Text: "03 Botellones"},
      {Cant: 3, Text: "03 Botellones"},
      {Cant: 4, Text: "04 Botellones"},
      {Cant: 5, Text: "05 Botellones"},
      {Cant: 10, Text: "10 Botellones"},
      {Cant: 20, Text: "20 Botellones"},
      {Cant: 30, Text: "30 Botellones"}
    ]

  }

  onRegistrarPedido(form: PedidoI){

    let canc = 0;
    if (this.Cancelado==true){
      canc = 1;
    }else{
      canc = 0;
    }
    let dFecha = new Date(form.Fecha);
    this.gQuery.sql(
        "sp_ventas_registrar", 
        form.IdCliente        +"|0|"+
        form.Precio           +"|"+
        canc                  +"|"+
        form.BotVendidos      +"|"+
        form.BotNewPrestado   +"|"+
        form.BotOldPrestado   +"|0|"+
        dFecha.toISOString().split('T')[0]
        ).subscribe(data =>{

          const MessageConfirm = Swal.mixin({
            customClass: {
              confirmButton: 'marg mat-raised-button mat-button-base mat-primary',
              cancelButton: 'marg mat-raised-button mat-button-base mat-warn'
            },
            buttonsStyling: false
          })
      
          MessageConfirm.fire({
            title: 'Venta registrada con éxito',
            text: "¿Desea registrar un nuevo pedido?",
            icon:"success",
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            reverseButtons: true
          }).then((result) => {
            if (result.value) {
              this.PedidoForm.setValue({
                IdCliente:"",
                Precio:3.00,
                BotVendidos:1,
                BotNewPrestado:0,
                BotOldPrestado:0,
                Fecha: new Date()
              })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              this.router.navigate(["/home"]);
            }
          })
    })

  }



  onNuevoCliente(){
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Siguiente &rarr;',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      progressSteps: ['1', '2', '3','4']
    }).queue([
      {title: 'Registrar Cliente', text: 'Nombre'},      
      {title: 'Registrar Cliente', text: 'Dirección'},
      {title: 'Registrar Cliente', text: 'Referencia'},
      {title: 'Registrar Cliente', text: 'Telefono', }
    ]).then((result) => {
      if(result.value){
      console.log(result);
      const resp = result.value;

      Swal.fire({
        title: '¡Confirme los datos!',
        html: `
          <table>
            <tr><td>Nombre</td><td>:</td><td>${resp[0]}</td></tr>
            <tr><td>Dirección</td><td>:</td><td>${resp[1]}</td></tr>
            <tr><td>Referencia</td><td>:</td><td>${resp[2]}</td></tr>
            <tr><td>Télefono</td><td>:</td><td>${resp[3]}</td></tr>
          </table>
        `,
        confirmButtonText: '¡Registrar!'
      }).then((res)=>{
        this.gQuery.sql("sp_clientes_registrar", resp[0]+"|||"+resp[1]+"|"+resp[2]+"|"+resp[3]).subscribe(data =>{
          Swal.fire(data[0]["message"]);
          if(data[0]["Estado"]==1){
            this.gQuery.sql("sp_clientes_devolver").subscribe(r=>{
            this.Clientes = r;
            })
          }
        })
      })
      }
    })
  }
}

import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {GBuscarComponent} from "../../shared/g-buscar/g-buscar.component";
import {GInputComponent} from "../../shared/g-input/g-input.component";
import {GMostrarComponent} from "../../shared/g-mostrar/g-mostrar.component";
import {MatDialog} from '@angular/material/dialog';
import {buscarI} from "../../../models/buscar.interface";
import {inputI} from "../../../models/input.interface";
import {contratoI, garantiaI, botellonesI} from "../../../models/contrato.interface";
import {tablaI} from "../../../models/tabla.interface";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {gQueryService} from "../../../services/g-query.service";

import { SubirService } from "../../../services/subir.service"
import { importType } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ContratosComponent implements OnInit {
  public buscar:buscarI;
  public input:inputI;
  public tabla:tablaI;
  public Contrato: contratoI;
  public garantias: garantiaI[];
  public botellones: botellonesI[];
  public Usuarios: any;


  // Subir imagen
  public respuestaImagenEnviada;
  public resultadoCarga;

  constructor(
    public dialog: MatDialog, 
    private gQuery:gQueryService, 
    
    // Subir imagen
    private enviandoImagen: SubirService
    ) { }
   
  public Cliente;
  public SelCliente = false;
  public selContrato = false;
  

  public ContratoForm = new FormGroup({
    Fecha: new FormControl(new Date() ,Validators.required),
    Numero: new FormControl("", Validators.required),
    IdVendedor: new FormControl("", Validators.required),
    Recibo_gar: new FormControl(""),
    TotalGarantia: new FormControl(""),
    TotalBotellones:new FormControl(""),
    GlosaBotellones: new FormControl("")
  });


  ngOnInit() {
    this.gQuery.buscar("Usuarios", "Id, Usuario", "Estado", "1")
    .subscribe(data =>{
      this.Usuarios = data;
    }) 

    
  } 
  
  onDeseleccionarCliente(){
    this.Cliente = "";
    this.SelCliente = false;
    this.selContrato = false;
  }

  onBuscarCliente(){
    this.buscar = <buscarI> {
      Campos : ["Id","Nombre","Direccion", "Referencia", "Telefono"],
      Columnas :['Nombre', "Direccion"],
      Criterio : "Nombre",
      Tabla : "Clientes",
      Titulo:"Buscar Cliente",
      // Subtitulo:"Buscar Cliente",
      Valor:""
    }

    const dialogRef = this.dialog.open(GBuscarComponent, {
      data: this.buscar,
      width: '600px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      
      if(result){
        // this.Cliente  = result;
        _self.Cliente = result;
        _self.SelCliente = true;        
        _self.selContrato = false;
        this.gQuery
        .sql("sp_contrato_devolver",_self.Cliente.Id)
        .subscribe(data =>{    
          if(data ==null) {
            _self.selContrato = false;
            return;
          }
          this.Contrato = <contratoI> {
            Id : data[0].Id,
            Fecha: data[0].Fecha,
            Numero: data[0].Numero,
            IdVendedor: data[0].IdVendedor,
            Vendedor: data[0].Vendedor,
            IdCliente: data[0].IdCliente,
            Cliente: data[0].Cliente,
            TotalGarantia: data[0].Garantia,
            TotalBotellones:data[0].Botellones,   
          }

          _self.selContrato = true;
          console.log("contrato", _self.Contrato)
        })
      }
    })
  }

  onMostrarGarantias(param){
    console.log(param);
    
    this.tabla = <tablaI>{
      Titulo:"Detalle de Garantia",
      Procedimiento: "sp_garantias_devolver",
      Datos: param.Id,
      Filtro:false,
      Columnas: ["Fecha", "Usuario","Recibo", "Garantia"]
    }
    const dialogRef = this.dialog.open(GMostrarComponent, {
      data: this.tabla,
      width: '600px',
    });
  }

  onMostrarBotellones(){
        
    this.tabla = <tablaI>{
      Titulo:"Detalle de Préstamo de botellones",
      Procedimiento: "sp_mov_botellones_devolver",
      Datos: this.Cliente.Id,
      Filtro:false,
      Columnas: ["Fecha", "Glosa", "Prestamo", "Total"]
    }
    const dialogRef = this.dialog.open(GMostrarComponent, {
      data: this.tabla,
      width: '600px',
    });
  } 

  onEditContrato(Contrato:contratoI, Campo:string){
    
    if(Campo=="Fecha"){
      var dia = Contrato.Fecha.substr(0,2);
      var mes = parseInt(Contrato.Fecha.substr(3,2))-1;
      var año = Contrato.Fecha.substr(6,4);        
      var nFecha = new Date(parseInt(año),mes,parseInt(dia),0,0,0);
  
      this.input = <inputI> {
        Titulo : "Actualizar "+ Campo,
        Campos: [
          {
            Nombre: Campo,
            Tipo:"Fecha",
            Etiqueta:Campo,
            Type:"text",
            Valor: nFecha,
            Validacion:[Validators.required]
          }
        ]
      }
    }else if(Campo=="Numero"){
      this.input = <inputI> {
        Titulo : "Actualizar Numero de Contrato",
        Campos: [
          {
            Nombre: Campo,
            Tipo:"Texto",
            Etiqueta:Campo,
            Valor:Contrato.Numero
          }
        ]
      }
    }else{
      this.input = <inputI> {
        Titulo : "Actualizar Vendedor",
        Campos: [
          {
            Nombre: "IdVendedor",
            Tipo:"Select",
            Etiqueta:"Venededor",
            Opciones: [],
            Valor: this.Contrato.IdVendedor
          }
        ]
      }
      
      for(var x=0; x <this.Usuarios.length; x++){
        this.input.Campos[0].Opciones.push({Valor: this.Usuarios[x].Id , Texto: this.Usuarios[x].Usuario })
      }
      
      
    }
 

    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '600px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(Campo =="Fecha"){
          this.gQuery.update("Contratos", "FechaFirma ='" +this.gQuery.fecha_2b(result["Fecha"]) + "'", "Id =" + this.Contrato.Id)
          .subscribe(data =>{    
            this.Contrato.Fecha = this.gQuery.fecha_2n(this.gQuery.fecha_2b(result["Fecha"]));
          });
        }else if(Campo=="Numero"){
          this.gQuery.update("Contratos", "Num ='" + result[Campo] + "'", "Id =" + this.Contrato.Id)
          .subscribe(data =>{    
            this.Contrato[Campo]=result[Campo];
          });
        }else{
          this.gQuery.update("Contratos", "IdUsuario ='" + result["IdVendedor"] + "'", "Id =" + this.Contrato.Id)
          .subscribe(data =>{
            for(var x=0; x <this.Usuarios.length; x++){
              if(this.Usuarios[x].Id == result["IdVendedor"]){
                this.Contrato.IdVendedor = result["IdVendedor"];
                this.Contrato.Vendedor = this.Usuarios[x].Usuario;
              }
            }
          });
        }
        
      }

      
      
    })
  }

  onRegistrarContrato(data){
    this.gQuery.sql("sp_contrato_registrar", 
      this.gQuery.fecha_2b(data.Fecha)+ "|" + 
      data.Numero                     + "|" + 
      data.IdVendedor                 + "|" + 
      this.Cliente.Id                 + "|" +
      data.Recibo_gar                 + "|" +
      data.TotalGarantia              + "|" +
      data.TotalBotellones            + "|" +
      data.GlosaBotellones
    )
    .subscribe(data =>{
      alert("Contrato registrado");
      this.onDeseleccionarCliente();
    }) 
  }

  onNuevoCliente(){
    this.input = <inputI> {
      Titulo : "Nuevo cliente",
      Campos: [
          {
            Nombre:"Nombre",
            Tipo:"Texto",
            Etiqueta:"Nombre",
            Valor:"",
            Validacion:[Validators.required]
          },
         {Nombre: "Direccion",Tipo:"Texto",Etiqueta:"Direccion",Valor: "", Validacion:[Validators.required]},
         {Nombre: "Referencia",Tipo:"Texto",Etiqueta:"Referencia",Valor: "", Validacion:[Validators.required]},
         {Nombre: "Mapa",Tipo:"Mapa"},
         {Nombre: "Telefono",Tipo:"Texto",Etiqueta:"Telefono",Valor: "", Requerido:true, Validacion:[Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]},
         {Nombre: "DNI",Tipo:"Texto",Etiqueta:"DNI",Valor: "", Validacion:[Validators.pattern("^[0-9]*$"), Validators.minLength(8)]},
         {Nombre: "RUC",Tipo:"Texto",Etiqueta:"RUC",Valor: "", Validacion:[Validators.pattern("^[0-9]*$"), Validators.minLength(11)]},
         {Nombre: "Foto",Tipo:"Archivo",Etiqueta:"Foto",Valor: "", Type:".gif,.jpg,.jpeg,.png", Validacion:[Validators.required]},
         
      ]
    }
    console.log(this.input );
    
    const dialogRef = this.dialog.open(GInputComponent, {
      data: this.input,
      width: '600px',
    });

    const _self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        console.log(result[0]);
        console.log(result[1]);
        
        
        this.gQuery.sql(
          "sp_clientes_registrar",
          result[1].Nombre         + "|" + 
          result[1].RUC            + "|" + 
          result[1].DNI            + "|" + 
          result[1].Direccion      + "|" + 
          result[1].Referencia     + "|" + 
          result[1].Telefono       
          ).subscribe(res =>{
            if(res[0].Estado==1){

              this.enviandoImagen.postFileImagen(result[0], res[0].Id).subscribe(
                response => {
                  this.respuestaImagenEnviada = response; 
                  if(this.respuestaImagenEnviada <= 1){
                    alert("Error subiendo imagen al servidor"); 
                  }else{
                    if(this.respuestaImagenEnviada.code == 200 && this.respuestaImagenEnviada.status == "success"){
                      this.resultadoCarga = 1;
                    }else{
                      this.resultadoCarga = 2;
                    }
                  }
                },
                error => {
                  alert(<any>error);
                }
              )

            }
            alert(res[0].message);
          }
        );
      }
    })
  }
}

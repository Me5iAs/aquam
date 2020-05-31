import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2'
import {gQueryService} from "../../../services/g-query.service";
import {SubirService} from "../../../services/subir.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {clienteI} from "../../../models/cliente.interface"



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ClientesComponent implements OnInit, AfterViewInit {

  // columnas del grid
  displayedColumns: string[] = ['Nombre', 'Direccion', 'Telefono', 'Acciones'];
  // fuente del grid
  dataSource = new MatTableDataSource();

  // variable para determinar en que modo está
  Modo = {Estado:0, Detalle:''} //0 lista, 1 nuevo, 2 editar, 3 detalle
  
  public imageUrl;
  public FileData;
  public File;
  public Cliente;

  Marcadores = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public cliN:clienteI;
  constructor(
    private gQuery:gQueryService, 
    private router:Router, 
    public dialog: MatDialog, 
    private enviandoImagen:SubirService) {
    this.FileData = [
      this.File,
      this.ClienteForm.value
    ]
  }

  // formulario de nuevo cliente
  ClienteForm = new FormGroup({
    Nombre  : new FormControl("", [Validators.required]),
    Direccion : new FormControl("",[Validators.required]),
    Referencia  : new FormControl("", [Validators.required]),
    Latitud  : new FormControl("" , [Validators.required]),
    Longitud  : new FormControl("" , [Validators.required]),
    Telefono  : new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    DNI : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
    RUC : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(11)]),
    Foto  : new FormControl("", [Validators.required])
  });

  // CARGA INICIAL
  // ===============
  ngOnInit() {
    // cargar clientes
    this.CargarClientes();  
  }

  CargarClientes(){
    this.gQuery
    .sql("sp_clientes_devolver")
    .subscribe(data =>{
      this.dataSource= new MatTableDataSource(<any> data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }
  ngAfterViewInit(){
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // NUEVO CLIENTE
  
    public previewImage(event) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = _event => {
        console.log(_event);
        this.imageUrl = reader.result;
      };
    }

    onFileChange(event) {
      if (event.target.files.length > 0) {
        this.File = event.target.files[0];
      }
      this.FileData = [
        this.File,
        this.ClienteForm.value
      ]

    }

    onMarcadores($event){ 

      this.ClienteForm.controls["Direccion"].setValue($event[0].label.text);
      this.ClienteForm.controls["Referencia"].setValue($event[0].title);
      this.ClienteForm.controls["Latitud"].setValue($event[0].position.lat);
      this.ClienteForm.controls["Longitud"].setValue($event[0].position.lng);
      
    }

    onRegistrarCliente(data){

      this.gQuery.sql(
        "sp_cliente_registrar",
        data.Nombre         + "|" + 
        data.RUC            + "|" + 
        data.DNI            + "|" + 
        data.Direccion      + "|" + 
        data.Referencia     + "|" + 
        data.Telefono       + "|" +        
        data.Latitud        + "|" + 
        data.Longitud
        ).subscribe(res =>{
          if(res[0].Estado==1){

            this.enviandoImagen.postFileImagen(this.File, res[0].Id).subscribe(
              response => {
                response = response; 
                if(response <= 1){
                  alert("Error subiendo imagen al servidor"); 
                }else{
                  this.CargarClientes()
                  this.Modo = {Estado:0, Detalle:''}
                }
              },
              error => {
                console.log(error);
                
                // alert(<any>error);
              }
            )

          }
          alert(res[0].message);
        }
      );
      
    }
  
    onNewCliente(){
      this.Modo = {Estado:1, Detalle:""}
    }

  // INFO CLIENTE
  
    onInfoCliente(event){
      this.Cliente = {};
      this.Modo = {Estado:2, Detalle:""}
      this.Cliente = {
        Id: event.Id,
        DNI : event.DNI,
        Nombre: event.Nombre,
        Telefono: event.Telefono,
        RUC: event.RUC,
        Direccion: event.Direccion,
        Referencia: event.Referencia,
        Img: "http://localhost/imagenes/" + event.Id,
        Marcador: [
          {
            position: {
              lat : Number(event.Latitud),
              lng: Number(event.Longitud),
            },
            label: {
              text: event.Direccion,
            },
            title: event.Referencia,
            options: {
              animation: google.maps.Animation.DROP,
            },
          }
        ]
      }

      console.log(this.Cliente);
      
      
    }
  
  // EDITAR CLIENTE
    onEditCliente(event){
      this.Modo = {Estado:3, Detalle:""}
      
      this.ClienteForm = new FormGroup({
        Id :  new FormControl(event.Id),
        Nombre  : new FormControl(event.Nombre, [Validators.required]),
        Direccion : new FormControl(event.Direccion,[Validators.required]),
        Referencia  : new FormControl(event.Referencia, [Validators.required]),
        Latitud  : new FormControl(event.Latitud , [Validators.required]),
        Longitud  : new FormControl(event.Longitud , [Validators.required]),
        Telefono  : new FormControl(event.Telefono, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
        DNI : new FormControl(event.DNI, [Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
        RUC : new FormControl(event.RUC, [Validators.pattern("^[0-9]*$"), Validators.minLength(11)]),
        Foto  : new FormControl(event.RUC, [Validators.required])
      });
      this.imageUrl = "http://localhost/imagenes/" + event.Id; 
      this.Marcadores = [
        {
          position: {
            lat : Number(event.Latitud),
            lng: Number(event.Longitud),
          },
          label: {
            text: event.Direccion,
          },
          title: event.Referencia,
          options: {
            animation: google.maps.Animation.DROP,
          },
        }
      ]     
    }

    onUpdateCliente(data){

      this.gQuery.sql(
        "sp_cliente_update",
        data.Id             + "|" + 
        data.Nombre         + "|" + 
        data.RUC            + "|" + 
        data.DNI            + "|" + 
        data.Direccion      + "|" + 
        data.Referencia     + "|" + 
        data.Telefono       + "|" +        
        data.Latitud        + "|" + 
        data.Longitud
        ).subscribe(res =>{
          if(res[0].Estado==1){

            this.enviandoImagen.postFileImagen(this.File, data.Id).subscribe(
              response => {
                response = response; 
                if(response <= 1){
                  alert("Error subiendo imagen al servidor"); 
                }else{
                  this.CargarClientes()
                  this.Modo = {Estado:0, Detalle:''}
                }
              },
              error => {
                console.log(error);
                
                // alert(<any>error);
              }
            )

          }
          alert(res[0].message);
        }
      );
      
    }

  
  onDelCliente(event){
    if(!confirm("Esta acción eliminará al cliente, desea continuar")) {
      return;
    }

    this.gQuery
      .sql("sp_cliente_delete",event.Id)
      .subscribe(res =>{
        alert("Cliente eliminado con éxito")
        this.CargarClientes()
        this.Modo = {Estado:0, Detalle:''}
      });
  }  

  onCancelarCliente(){
    this.Modo = {Estado:0, Detalle:""}
  }

 

 
}


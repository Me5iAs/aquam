import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2'
import {gQueryService} from "./../../../services/g-query.service";
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

  Marcadores = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public cliN:clienteI;
  constructor(private gQuery:gQueryService, private router:Router, public dialog: MatDialog) {
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
    Telefono  : new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
    DNI : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
    RUC : new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(11)]),
    Foto  : new FormControl("", [Validators.required])
  });

  // CARGA INICIAL
  // ===============
  ngOnInit() {
    // cargar clientes
    this.gQuery
    .sql("sp_totalclientes_devolver")
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
  }

  // NUEVO CLIENTE
  // =============

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
      console.log($event);
    }

    onRegistrarCliente(val){
      console.log(val);
      
    }

  onModalCliente(cliente:clienteI, pAccion:"Info"|"Editar"|"Eliminar"|"Nuevo"){
    if(pAccion=="Nuevo"){
      this.Modo = {Estado:1, Detalle:""}
    }
    return;
    if(pAccion =="Nuevo"){
      cliente = <clienteI> {
        Id: "",
        Nombre: "",
        RUC: "",
        DNI: "",
        Direccion: "",
        Referencia: "",
        Telefono: "",  
        Accion: "Nuevo",
        Contrato:""
      }  
    }else{
      cliente.Accion = pAccion;
    }
    
    // console.log(cliente.Accion);
    const dialogRef = this.dialog.open(DialogCliente, {
      data: cliente,
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.gQuery
        .sql("sp_totalclientes_devolver")
        .subscribe(data =>{
          
          this.dataSource= new MatTableDataSource(<any> data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
      console.log(result);
      
    });
  }


 
}

@Component({
  selector: 'dialog-cliente',
  templateUrl: 'dialog-cliente.html',
  styleUrls: ['./clientes.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class DialogCliente implements OnInit{
  
  ngOnInit(): void {
   
  }

  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<DialogCliente>,
    @Inject(MAT_DIALOG_DATA) public dataCliente: clienteI) {
    
      if(dataCliente.Accion == "Nuevo"){
        this.ClienteForm = new FormGroup({
          Nombre: new FormControl("" ,Validators.required),
          Direccion: new FormControl("", Validators.required),
          Referencia: new FormControl("", Validators.required),
          Telefono: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6), Validators.maxLength(9)]),
          RUC: new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11) ]),
          DNI: new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.minLength(8), Validators.minLength(8)]),
          Contrato: new FormControl(""),
        });
      }
      
    }
    
    ClienteForm = new FormGroup({
      Nombre: new FormControl(this.dataCliente.Nombre ,Validators.required),
      Direccion: new FormControl(this.dataCliente.Direccion, Validators.required),
      Referencia: new FormControl(this.dataCliente.Referencia, Validators.required),
      Telefono: new FormControl(this.dataCliente.Telefono, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6)]),
      RUC: new FormControl(this.dataCliente.RUC, [Validators.pattern("^[0-9]*$"), Validators.minLength(11)]),
      DNI: new FormControl(this.dataCliente.DNI, [Validators.pattern("^[0-9]*$"), Validators.minLength(8)]),
      Contrato: new FormControl(new Date(this.dataCliente.Contrato)),
    });


    onCancel(): void {
    this.dialogRef.close();
  }

  onUpdateCliente(data: clienteI){
    // let sFecha = "";
    // if(data.Contrato!=""){
    //   let dFecha = new Date(data.Contrato);
    //   sFecha = dFecha.toISOString().split('T')[0];  
    // } 
    
    
    this.gQuery.sql(
      "sp_cliente_update",
      this.dataCliente.Id + "|" + 
      data.Nombre         + "|" + 
      data.RUC            + "|" + 
      data.DNI            + "|" + 
      data.Direccion      + "|" + 
      data.Referencia     + "|" + 
      data.Telefono      
      ).subscribe(res =>{
        Swal.fire(res[0].message);
        if(res[0].Estado==1){
          this.dialogRef.close(true);
        }
      });
  }

  onDelCliente(data: clienteI){
    this.gQuery.sql(
      "sp_cliente_delete",
      this.dataCliente.Id).subscribe(res =>{
        Swal.fire(res[0].message);
        this.dialogRef.close(true);
      });
  }

  onNewCliente(data:clienteI){
    // let sFecha = "";
    // if(data.Contrato!=""){
    //   let dFecha = new Date(data.Contrato);
    //   sFecha = dFecha.toISOString().split('T')[0];  
    // } 

    this.gQuery.sql(
      "sp_clientes_registrar",
      data.Nombre         + "|" + 
      data.RUC            + "|" + 
      data.DNI            + "|" + 
      data.Direccion      + "|" + 
      data.Referencia     + "|" + 
      data.Telefono       
      ).subscribe(res =>{
        Swal.fire(res[0].message);
        if(res[0].Estado==1){
          this.dialogRef.close(true);
        }
      }
    );
  }

}
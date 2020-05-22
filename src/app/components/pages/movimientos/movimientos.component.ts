import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2'
import {gQueryService} from "../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {movimientoI} from "../../../models/movimiento.interface"

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class movimientosComponent implements OnInit {

  displayedColumns: string[] = ['Fecha', 'Usuario', 'Categoria', 'Monto','Acciones'];
  dataSource = new MatTableDataSource();
  public Categoria = [
    {
      Nombre: "Ingresos",
      Categoria: [] 
    },
    {
      Nombre: "Gastos",
      Categoria: [] 
    },
  ];

  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public movb:movimientoI;
  constructor(private gQuery:gQueryService, private router:Router, public dialog: MatDialog) { }
  
  cargar_ig(){
    this.gQuery
    .sql("sp_mov_devolver")
    .subscribe(data =>{
      console.log(data);
      
      if(data){
        console.log("algo");
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }else{
        console.log("nada");
        
      }
      
    });
  }
  ngOnInit() {
    this.cargar_ig();

    // Cargar categorias
    this.gQuery
    .sql("sp_mov_cat_devolver","2")
    .subscribe(data =>{      
    
      if(data ==null) return;

      var datos:any = data;
      for(var x=0; x <datos.length; x++){
        if(datos[x].Filtro ==1){
          this.Categoria[0].Categoria.push({Id: datos[x].Id, Categoria: datos[x].Categoria});
        }else{
          this.Categoria[1].Categoria.push({Id: datos[x].Id, Categoria: datos[x].Categoria});
        }
      }
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onModalMovimiento(mov:movimientoI, pAccion:"Nuevo" | "Info"){
    if(pAccion =="Nuevo"){
      mov = <movimientoI> {
        Id: "",
        Fecha: new Date(),
        Usuario: "",
        IdCat:"",
        Categoria: "",
        Glosa: "",
        Tipo:"",
        Monto: 0,
        Accion: "Nuevo",
        Categorias: this.Categoria 
      }  
    }else{
      mov.Accion = pAccion;
    }

    const dialogRef = this.dialog.open(Dialogmovimientos, {
      data: mov,
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.cargar_ig();
      }
    });
  }
}



@Component({
  selector: 'dialog-movimientos',
  templateUrl: 'dialog-movimientos.html',
  styleUrls: ['./movimientos.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class Dialogmovimientos implements OnInit{
  MovimientoForm: FormGroup;
  
  ngOnInit(): void {
   
  }

  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<Dialogmovimientos>,
    @Inject(MAT_DIALOG_DATA) public dataMov: movimientoI) {

      

      if(dataMov.Accion == "Nuevo"){
        this.MovimientoForm = new FormGroup({
          Fecha: new FormControl(this.dataMov.Fecha,Validators.required),
          Monto: new FormControl("", [Validators.pattern("^[0-9]*$"), Validators.required]),
          IdCat: new FormControl("", Validators.required),
          Glosa: new FormControl("", Validators.required)
        });
      }else{
        this.MovimientoForm = new FormGroup({
          Id: new FormControl(this.dataMov.Id),
          Fecha: new FormControl(new Date(this.dataMov.Fecha)),
          Tipo: new FormControl(this.dataMov.Tipo),
          Monto: new FormControl(this.dataMov.Monto),
          Categoria: new FormControl(this.dataMov.Categoria),
          Glosa: new FormControl(this.dataMov.Glosa),
          Usuario: new FormControl(this.dataMov.Usuario)
        });
      }
      console.log(dataMov);
    }
    




    onCancel(): void {
    this.dialogRef.close();
  }

  onDelMov(data: movimientoI){
    this.gQuery.sql(
      "sp_mov_delete",
      this.dataMov.Id).subscribe(res =>{
        Swal.fire(res[0].Message);
        this.dialogRef.close(true);
    });
  }

  onNewMov(data:movimientoI){
    let sFecha = new Date(data.Fecha);
    let dFecha = sFecha.toISOString().split('T')[0];   
    
    this.gQuery.sql(
      "sp_mov_registrar",
      dFecha      + "|" + 
      data.IdCat  + "|" + 
      data.Glosa  + "|" + 
      data.Monto  + "|" + 
      JSON.parse(sessionStorage.dataUser).Id         
      ).subscribe(res =>{
        Swal.fire(res[0].Message);
        if(res[0].Estado==1){
          this.dialogRef.close(true);
        }else{
          alert(res[0].Message)
        }
      }
    );
  }

}

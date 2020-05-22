import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {MatPaginator} from '@angular/material/paginator';
import Swal from 'sweetalert2';
import {gQueryService} from "../../../services/g-query.service";
import {Router} from "@angular/router";
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from "../../format-datepicker";
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface movI {
  // atributos
  Id: string;
  Fecha: Date;
  Tipo: string;
  Detalle:string;
  Categoria:string;
  Total: string;
  Pago: string;
}

@Component({
  selector: 'app-rep-mov',
  templateUrl: './rep-mov.component.html',
  styleUrls: ['./rep-mov.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class RepMovComponent implements OnInit {

  displayedColumns: string[] = ['Fecha', "Categoria", 'Detalle', 'Total','Pago', "Acciones"];
  dataSource = new MatTableDataSource();

  
   
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  public movb:movI;
  public fDesde;
  public fHasta;
  
  constructor(private gQuery:gQueryService, private router:Router, public dialog: MatDialog) { 
  this.fDesde =  new Date();
  this.fHasta = new Date();
  this.fHasta = new FormControl(new Date());
  this.fDesde.setMonth(this.fDesde.getMonth() - 1);
  this.fDesde = new FormControl(this.fDesde)
  }
 
 
  // this.desde = f.getYear + "-" + f.getMonth + "-" + f. 
//   fecha_2b(date) {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) 
//         month = '0' + month;
//     if (day.length < 2) 
//         day = '0' + day;

//     return [year, month, day].join('-');
// }

  cargar_mov(){
    this.dataSource = new MatTableDataSource();
    this.gQuery
    .sql("sp_rep_mov_devolver", this.gQuery.fecha_2b(this.fDesde.value) +"|"+this.gQuery.fecha_2b(this.fHasta.value))
    .subscribe(data =>{
      console.log(data);
      if(data){
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
  ngOnInit() {
    this.cargar_mov();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onModalMovimiento(mov:movI){

    const dialogRef = this.dialog.open(DialogMovRep, {
      data: mov,
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.cargar_mov();
      }
    });
  }
}



@Component({
  selector: 'dialog-mov-rep',
  templateUrl: 'dialog-mov-rep.html',
  styleUrls: ['./rep-mov.component.styl'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

export class DialogMovRep implements OnInit{
  MovimientoForm: FormGroup;
  
  ngOnInit(): void {
   
  }

  constructor(
    private gQuery: gQueryService,
    public dialogRef: MatDialogRef<DialogMovRep>,
    @Inject(MAT_DIALOG_DATA) public dataMov: movI) {
      console.log(this.dataMov);
      
      this .MovimientoForm = new FormGroup({
        Fecha: new FormControl(this.dataMov.Fecha),
        Tipo: new FormControl(this.dataMov.Tipo),  
        Categoria: new FormControl(this.dataMov.Categoria),
        Detalle: new FormControl(this.dataMov.Detalle),
        Total: new FormControl(this.dataMov.Total),
        Pago: new FormControl(this.dataMov.Pago)
      });
    }
    




    onCancel(): void {
    this.dialogRef.close();
  }


}

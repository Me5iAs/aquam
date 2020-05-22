import { Component, OnInit, Input, Inject, ViewChild  } from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { gQueryService } from "../../../services/g-query.service"
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {tablaI} from "../../../models/tabla.interface";

@Component({
  selector: 'app-gtabla',
  templateUrl: './g-tabla.component.html',
  styleUrls: ['./g-tabla.component.styl']
})
export class GTablaComponent implements OnInit {
  @Input() public gTablaData: tablaI;
  
  // Nota: Para que funcione debe incluirse en la parte de "declarations" del moduloque vaya a ser usado, no se incluye en el componente en sí
  
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
    
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private gQuery: gQueryService) {}

  ngOnInit() {
    this.displayedColumns= this.gTablaData.Columnas;
    
    if(this.gTablaData.Datos || this.gTablaData.Datos!=""){
      this.gQuery
      .sql(this.gTablaData.Procedimiento, this.gTablaData.Datos)
      .subscribe(data =>{
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      this.dataSource.sort = this.sort;    
    }else{
      this.gQuery
      .sql(this.gTablaData.Procedimiento)
      .subscribe(data =>{
        this.dataSource= new MatTableDataSource(<any> data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      this.dataSource.sort = this.sort;
    }
   
  }

   applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
   }
}

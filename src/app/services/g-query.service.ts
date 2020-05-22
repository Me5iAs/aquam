import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map} from "rxjs/operators/";


const url_api = "http://192.168.1.42/gQuery.php";
// const url_api = "http://localhost/gQuery.php";
// const url_api = "backend/gQuery.php";
// data.datos = data.datos.replace(/"/gi,"");
// data.datos = data.datos.replace(/'/gi,"");

const Cabecera: HttpHeaders = new HttpHeaders({
  "Content-type": "application/json"
});
@Injectable({
  providedIn: 'root'
})
export class gQueryService {
// const url_api = "http://localhost/gQuery.php";
  constructor(private http:HttpClient) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json"
  });

  
  sql(procedimiento:string, datos?:string){
    return this.http.post(url_api, {name:procedimiento, datos: datos},
      {headers: Cabecera}).pipe(map(data=>data));
  }

  buscar(tabla:string, campos:string, criterio:string, valor:string){
    var sql = "select " + campos + " from " + tabla + " where " + criterio + " like '%" + valor + "%'";
    return this.http.post(url_api, {name:"Buscar", datos: sql},
      {headers: Cabecera}).pipe(map(data=>data));
  }

  update(tabla:string, campos:string, criterio:string){
    var sql = "update " + tabla + " set " + campos + " where " + criterio;
    return this.http.post(url_api, {name:"Execute", datos: sql},
      {headers: Cabecera}).pipe(map(data=>data));
  }

  fecha_2b(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  fecha_2n(fecha:string){
    return [fecha.substr(8,2), fecha.substr(5,2), fecha.substr(0,4) ].join("/");
  }
}

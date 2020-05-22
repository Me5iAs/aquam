import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import {UsuarioI} from "../models/usuario.interface";
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import Swal from 'sweetalert2'

const url_api = "http://192.168.1.42/gSesions.php";
//  const url_api = "http://localhost/gSesions.php";
// const url_api = "backend/gSesions.php";
const Cabecera: HttpHeaders = new HttpHeaders({
  "Content-type": "application/json"
});

@Injectable({providedIn: 'root'})

export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(!!sessionStorage.getItem("dataUser"));

  constructor(private http: HttpClient, private router:Router) {
    // this.loggedIn.next(!!sessionStorage.getItem("dataUser"));    
  }

  
  

  login(user: UsuarioI){
    if(user.Usuario ==""){
      Swal.fire("¡Error!","Ingrese su usuario","error");
      return false;
    }else if(user.Clave ==""){
      Swal.fire("¡Error!","Ingrese su clave","error");
      return false;
    }
    this.http.post(url_api, {tipo:"login", Usuario:user.Usuario, Clave:user.Clave},
    {headers: Cabecera})
    .subscribe(data =>{
      switch (data[0].Estado) {
        case "-1":
        Swal.fire("¡Algo ha salido mal!", "La contraseña ingresada no es válida para el usuario","error");
        break;
        case "0":
          Swal.fire("¡Algo ha salido mal!", "El usuario ingresado no se encuentra registrado en el sitema","error");
          
          break;
        default:
          user.Id = data[0].Id;
          user.Tipo = data[0].Tipo;
          sessionStorage.setItem("dataUser", JSON.stringify(user));
          this.loggedIn.next(true);
          let timerInterval
          Swal.fire({
            title: '¡Sesión Iniciada!',
            html: 'Bienvenido ' + user.Usuario + ", espere un momento a que se cargue el sistema.",
            icon:"success",
            timer: 3000,
            timerProgressBar: true,
            onBeforeOpen: () => {
              Swal.showLoading()
              timerInterval = setInterval(() => {
                const content = Swal.getContent()
                if (content) {
                  const b = content.querySelector('b')
                  if (b) {
                    // b.innerHTML(Swal.getTimerLeft())
                  }
                }
              }, 100)
            },
            onClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
          this.router.navigate(["/"]);
      }
    });
  }

  logout():void{
    sessionStorage.removeItem("dataUser");
    this.loggedIn.next(false);
    this.router.navigate(["/login"]);
  }
  
}

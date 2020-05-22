import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { UsuarioI } from "../../models/usuario.interface";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.styl']
})
export class LoginComponent implements OnInit {

  constructor(public auth:AuthService, private route:Router) { }

  loginForm = new FormGroup({
    Usuario: new FormControl("",Validators.required),
    Clave: new FormControl("", Validators.required)
  });

  ngOnInit() {}

  onLogin(form: UsuarioI){
    this.auth.login(form);
  }

  onLogout(){
    this.auth.logout();
  }

}

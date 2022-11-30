import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// Clases
import ISesion from '../classes/interface.sesion';
import Usuario from '../classes/class.usuario';
// Servicios
import { UsuariosService } from '../services/usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AdministradorGuard implements CanActivate {

  constructor(private _usuariosService: UsuariosService,
              private router: Router) {}
  
  canActivate(): boolean {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    if (sesion) {
      return sesion.perfil == Usuario.ADMINISTRADOR;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}

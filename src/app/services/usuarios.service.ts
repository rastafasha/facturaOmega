import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map, catchError} from 'rxjs/operators';
import {throwError, Observable} from 'rxjs';

// Configuracion
import * as config from '../config/config';

// Clases
import Usuario from '../classes/class.usuario';
import ISesion from '../classes/interface.sesion';
import RFC from '../classes/class.rfc';
import IResponseUsuario from '../classes/interface.responseusuario';
import {Address} from '../classes/class.address';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  @Output() sessionUpdated: EventEmitter<any> = new EventEmitter();

  path = `${config.URL_SERVICES}/usuarios/`;

  // -------------------------------------------------------------------
  // Constructor de la clase
  // -------------------------------------------------------------------
  constructor(private http: HttpClient,
              private router: Router) {
  }

  // -------------------------------------------------------------------
  // Login por Email y Password
  // -------------------------------------------------------------------
  login(email: string, password: string) {
    const body: any = {email, password};

    return this.http.post(`${this.path}login`, body)
      .pipe(
        map((res: any) => {
          this.guardarSesion(res);
          this.redireccionar();
        }),
        catchError(err => throwError(err))
      );
  } // login


  // -------------------------------------------------------------------
  // Registrar usuario
  // -------------------------------------------------------------------
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post(`${this.path}new`, usuario.toJson())
      .pipe(
        map(({usuario}: any) => new Usuario('', '', '', '').fromJson(usuario)),
        catchError(err => throwError(err))
      );
  } // registrar


  // -------------------------------------------------------------------
  // Actualizar usuario
  // -------------------------------------------------------------------
  actualizar(usuario: Usuario): Observable<Usuario> {
    return this.http.put(`${this.path}update/${usuario.id}`, usuario.toJson())
      .pipe(
        map(({usuario}: any) => new Usuario('', '', '', '').fromJson(usuario)),
        catchError(err => throwError(err))
      );
  } // actualizar


  // -------------------------------------------------------------------
  // Nuevo usuario
  // -------------------------------------------------------------------
  nuevo(usuario: Usuario): Observable<Usuario> {
    return this.http.post(`${this.path}insert/${usuario.id}`, usuario.toJson())
      .pipe(
        map(({usuario}: any) => new Usuario('', '', '', '').fromJson(usuario)),
        catchError(err => throwError(err))
      );
  } // nuevo


  // -------------------------------------------------------------------
  // Cargar usuario
  // -------------------------------------------------------------------
  cargar(id: number): Observable<Usuario> {
    return this.http.get(`${this.path}load/${id}`)
      .pipe(
        map(({usuario}: any) => new Usuario('', '', '', '').fromJson(usuario)),
        catchError(err => throwError(err))
      );
  } // cargar


  // -------------------------------------------------------------------
  // Obtener listado de usuarios
  // -------------------------------------------------------------------
  cargarTodos(filtros: any = {}, pagina: number = 1, paginaSize = 20): Observable<IResponseUsuario> {
    const url = `${this.path}all/${pagina}/${paginaSize}`;

    return this.http.post(url, filtros)
      .pipe(
        map((res: any) => {
          return {
            usuarios: res.usuarios.map(usuario => new Usuario('', '', '', '').fromJson(usuario)),
            ok: res.ok,
            pag_actual: res.pag_actual,
            pag_anterior: res.pag_anterior,
            total_paginas: res.total_paginas,
            total_registros: res.total_registros,
          };
        }),
        catchError(err => throwError(err))
      );
  } // cargarTodos


  // -------------------------------------------------------------------
  // Actualizar el status del usuario
  // -------------------------------------------------------------------
  cambiarStatus(usuario: Usuario): Observable<Usuario> {
    return this.http.put(`${this.path}status/${usuario.id}`, usuario.toJson())
      .pipe(
        map(({usuario}: any) => new Usuario('', '', '', '').fromJson(usuario)),
        catchError(err => throwError(err))
      );
  } // cambiarStatus


  // -------------------------------------------------------------------
  // Recupera la contraseña del usuario
  // -------------------------------------------------------------------
  recuperarPassword(email: string): Observable<any> {
    const req: any = {email};
    return this.http.put(`${this.path}recovery`, req)
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  } // recuperarPassword


  // -------------------------------------------------------------------
  // Cambia la contraseña del usuario
  // -------------------------------------------------------------------
  cambiarPassword(password: string): Observable<any> {
    const req: any = {password};

    return this.http.put(`${this.path}change_password`, req)
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  } // cambiarPassword


  // -------------------------------------------------------------------
  // Cambia la contraseña del usuario
  // -------------------------------------------------------------------
  reiniciarPassword(usuario: Usuario): Observable<any> {
    const req: any = {id: usuario.id};

    return this.http.put(`${this.path}reset_password`, req)
      .pipe(
        map((res: any) => res.usuario),
        catchError(err => throwError(err))
      );
  } // cambiarPassword


  // -------------------------------------------------------------------
  // Redireccionar
  // -------------------------------------------------------------------
  redireccionar(): void {
    const sesion: ISesion = this.obtenerSesion();

    if (!sesion) {
      // Si no hay sesion redireccionamos al login
      this.router.navigate(['/login']);
    } else {
      // si hay sesion verificamos si tiene un perfil asignado
      if (!sesion.perfil) {
        if (sesion.usuario.perfiles.length == 0) {
          // si no tiene un perfil asignado, asignamos cliente por default
          sesion.usuario.perfiles.push(Usuario.CLIENTE);
          sesion.perfil = Usuario.CLIENTE;
        } else {
          // Si tiene perfil asignado le designamos el primero
          sesion.perfil = sesion.usuario.perfiles[0];
        }

        this.guardarSesion(sesion);
        // Redireccionamos
        this.redireccionar();

      } else {
        // Si ya tiene un perfil asignado redireccionamos
        switch (sesion.perfil) {
          case Usuario.CLIENTE:
            this.router.navigate([`/${config.RUTA_CLIENTE}/mi_rfc`]);
            break;
          case Usuario.ADMINISTRADOR:
            this.router.navigate([`/${config.RUTA_ADMINISTRADOR}/perfil`]);
            break;
          case Usuario.CAPTURISTA:
            this.router.navigate([`/${config.RUTA_CAPTURISTA}/perfil`]);
            break;
          default:
            this.router.navigate([`/login`]);
        } // switch
      } // else perfil
    } // else sesion
  }


  // -------------------------------------------------------------------
  // Guardar el usuario en la sesion
  // -------------------------------------------------------------------
  guardarSesion(sesion: ISesion): void {
    if (sesion.rfc) {
      try {
        sesion.rfc = sesion.rfc.toJson();
      } catch (e) {
      }
    }
    localStorage.setItem(config.SESSION_USUARIO_NAME, JSON.stringify(sesion));
    this.sessionUpdated.emit(sesion);
  } // localStorage


  // -------------------------------------------------------------------
  // Limpia la sesion local
  // -------------------------------------------------------------------
  limpiarSesion(): void {
    localStorage.removeItem(config.SESSION_USUARIO_NAME);
  } // limpiarSesion


  // -------------------------------------------------------------------
  // Devolver usuario almacenado en sesion
  // -------------------------------------------------------------------
  obtenerSesion(): ISesion {
    const sesion: string = localStorage.getItem(config.SESSION_USUARIO_NAME);

    if (!sesion) {
      return null;
    }

    const objeto: any = JSON.parse(sesion);

    const usuario: Usuario = new Usuario('', '', '', '');

    usuario.fromJson(objeto.usuario);

    let rfc: RFC;
    if (objeto.rfc) {
      rfc = new RFC('', '', '', new Address());
      rfc.fromJson(objeto.rfc);
    }

    return {
      usuario,
      token: objeto.token,
      rfc,
      perfil: objeto.perfil,
      path: objeto.path
    };
  } // obtenerSesion

}

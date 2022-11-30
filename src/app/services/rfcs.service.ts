import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {throwError, Observable} from 'rxjs';

// Configuracion
import * as config from '../config/config';

// Clases
import RFC from '../classes/class.rfc';
import ISesion from '../classes/interface.sesion';

// Servicios
import {UsuariosService} from './usuarios.service';
import {Address} from '../classes/class.address';

@Injectable({
  providedIn: 'root'
})
export class RfcsService {

  path = `${config.URL_SERVICES}/rfcs/`;

  // -------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------
  constructor(private http: HttpClient,
              private _usuariosService: UsuariosService) {
  } // constructor


  // -------------------------------------------------------------------
  // guardar RFC
  // -------------------------------------------------------------------
  guardar(rfc: RFC): Observable<RFC> {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.post(`${this.path}/insert`, rfc.toJson(), headers)
      .pipe(
        map((res: any) => res.rfc),
        catchError(err => throwError(err))
      );
  } // guardar

  // -------------------------------------------------------------------
  // Actualizar RFC
  // -------------------------------------------------------------------
  actualizar(rfc: RFC): Observable<RFC> {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.put(`${this.path}/update/${rfc.id}`, rfc.toJson(), headers)
      .pipe(
        map((res: any) => res.rfc),
        catchError(err => throwError(err))
      );
  } // actualizar

  // -------------------------------------------------------------------
  // Cargar RFC
  // -------------------------------------------------------------------
  cargar(id: number): Observable<RFC> {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.get(`${this.path}/load/${id}`, headers)
      .pipe(
        map((res: any) => res.rfc),
        catchError(err => throwError(err))
      );
  } // cargar

  // -------------------------------------------------------------------
  // Cargar todos los RFC's
  // -------------------------------------------------------------------
  cargarTodos(filtros: any = {}, page: number = 0, limit: number = 0) {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    const url = `${this.path}/all/${page}/${limit}`;
    return this.http.post(url, filtros, headers)
      .pipe(
        map((res: any) => {
          const rfcs: RFC[] = [];
          res.rfcs.forEach(r => {
            const rfc: RFC = new RFC('', '', '', new Address());
            rfc.fromJson(r);
            rfcs.push(rfc);
          });

          res.rfcs = rfcs;
          return res;
        }),
        catchError(err => throwError(err))
      );
  } // cargarTodos


  // -------------------------------------------------------------------
  // Eliminar RFC
  // -------------------------------------------------------------------
  eliminar(rfc: RFC): Observable<number> {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.delete(`${this.path}/delete/${rfc.id}`, headers)
      .pipe(
        map((res: any) => res.eliminado),
        catchError(err => throwError(err))
      );
  } // eliminar
}

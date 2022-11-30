/**
 * @author Hugo Gionori Soto Miguel
 * @fileoverview Servicio para operaciones con tarifas
 * @version 1.0.0
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';

// Configuracion
import * as config from '../config/config';

// Clases
import { Tarifa } from '../classes/tarifa';

@Injectable({
  providedIn: 'root'
})
export class TarifasService {

  readonly path: string = `${config.URL_SERVICES}/tarifas/`;

  /**
   * @constructor
   * @param http Maneja operaciones con el backend
   * @param _usuariosService Servicio de usuarios
   */
  constructor(private http: HttpClient) {}

  /**
   * @method guardar
   * @description Guarda una tarifa en la base de datos
   * @param tarifa 
   * @return {Observable<Tarifa>}
   */
  guardar(tarifa: Tarifa): Observable<Tarifa> {
    return this.http.post(`${this.path}insert`, tarifa.toJSON())
      .pipe(
        map(({ tarifa }: any) => new Tarifa().fromJSON(tarifa)),
        catchError(err => throwError(err))
      ); 
  } // guardar


  /**
   * @method actualizar
   * @description Actualiza una tarifa en la base de datos
   * @param tarifa 
   * @return {Observable<Tarifa>}
   */
   actualizar(tarifa: Tarifa): Observable<Tarifa> {
    return this.http.put(`${this.path}update/${tarifa.id}`, tarifa.toJSON())
      .pipe(
        map(({ tarifa }: any) => new Tarifa().fromJSON(tarifa)),
        catchError(err => throwError(err))
      ); 
  } // actualizar

 
  /**
   * @method eliminar
   * @description Elimina una tarifa de la base de datos
   * @param tarifa Tarifa que sera eliminada
   * @return {Observable<Tarifa>}
   */
  eliminar(tarifa: Tarifa): Observable<Tarifa> {
    const url: string = `${this.path}delete/${tarifa.id}`;
    return this.http.delete(url)
      .pipe(
        map(({ tarifa }: any) => new Tarifa().fromJSON(tarifa)),
        catchError(err => throwError(err))
      ); 
  } // eliminar

  /**
   * @mathod cargarTodos
   * @description Obtiene las tarifas coincidentes con los filtros
   * @param filtros Filtros de busqueda
   * @param pagina Pagina actual
   * @param paginaSize Tamanio de la pagina
   * @return {Observable<any>}
   */
  cargarTodos(filtros: any = {}, pagina: number = 0, paginaSize: number = 0): Observable<any> {
    const url: string = `${this.path}all/${pagina}/${paginaSize}`    
    return this.http.post(url, filtros)
      .pipe(
        map((res: any) => {
          return {
            tarifas: res.tarifas.map(tarifa => new Tarifa().fromJSON(tarifa))
          }
        }),
        catchError(err => throwError(err))
      ); 
  } // cargarTodos


  /**
   * @method
   * @description Obtiene una tarifa de la base de datos
   * @param id Id de la tarifa
   * @return {Observable<Tarifa>}
   */
  cargar(id: string): Observable<Tarifa> {
    const url: string = `${this.path}load/${id}`;
    return this.http.get(url)
      .pipe(
        map(({ tarifa }: any) => new Tarifa().fromJSON(tarifa)),
        catchError(err => throwError(err))
      ); 
  } // cargarTodos


  
}

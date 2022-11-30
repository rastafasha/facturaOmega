/**
 * @author Hugo Gionori Soto Miguel
 * @fileoverview Servicio para operaciones con boletos
 * @version 2.0.0
 *
 * History
 * v2.0.0 - Implementacion de interceptor y clase Ticket
 * v1.0.0 - Servicio terminado
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';

// Configuracion
import * as config from '../config/config';

// Clases
import { Boleto } from '../classes/class.boleto';
import IResponseBoleto from '../classes/interface.responseboleto';

// Librerias
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TIPOS_IMPORTACION } from '../config/config';

import { TipoImport} from '../models/tipoImportacion'

@Injectable({
  providedIn: 'root'
})
export class BoletosService {

  path: string = `${config.URL_SERVICES}/boletos/`;

  /**
   * @constructor
   * @param http Maneja operaciones con el backend
   * @param _usuariosService Servicio de usuarios
   */

  public tipoI: TipoImport;




   tiposImport: TipoImport[] = [
    {
      id: 1,
      desc: 'Formato Normal y Cuota Reducida',
      config: {
          fila_inicial: 13,
          fecha: 0,
          hora: 1,
          carril: 2,
          senal: 6,
          tarifa: 8,
          pago: 10,
          folio: 11
      }
  },
  {
      id: 2,
      desc: 'IAVE y TAG',
      config: {
          fila_inicial: 13,
          fecha: 0,
          hora: 1,
          carril: 2,
          senal: 12,
          tarifa: null,
          pago: 13,
          folio: 15
      }
  }
  ];
  constructor(private http: HttpClient) {}

  /**
   * @description Envia la data al backend para su almacenamiento
   * @param boletos Boletos a importar
   * @returns {Observable}
   */
  importar(boletos: any[]):Observable<any> {
    return this.http.post(`${this.path}import`, boletos)
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  } // importar

  // -------------------------------------------------------------------
  // Agrega un boleto a la base de datos
  // -------------------------------------------------------------------
  guardar(boleto: Boleto): Observable<Boleto> {
    return this.http.post(`${this.path}insert`, boleto.toJson())
      .pipe(
        map((res: any) => {
          const nuevoBoleto: Boleto = new Boleto();
          nuevoBoleto.fromJson(res.boleto);
          return nuevoBoleto;
        }),
        catchError(err => throwError(err))
      );
  } // guardar


  // -------------------------------------------------------------------
  // Actualiza un boleto del la base de datos
  // -------------------------------------------------------------------
  actualizar(boleto: Boleto, fecha: string, hora: string, carril: number, folio: string): Observable<Boleto> {
    const url: string = `${this.path}update/${fecha}/${hora}/${carril}/${folio}`;

    return this.http.put(url, boleto.toJson())
      .pipe(
        map((res: any) => {
          const boletoActualizado: Boleto = new Boleto();
          boletoActualizado.fromJson(res.boleto);
          return boletoActualizado;
        }),
        catchError(err => throwError(err))
      );
  } // actualizar


  // -------------------------------------------------------------------
  // Elimina un boleto del la base de datos
  // -------------------------------------------------------------------
  eliminar(boleto: Boleto): Observable<Boleto> {
    const url: string = `${this.path}delete/${boleto.fecha}/${boleto.hora}/${boleto.carril}/${boleto.folio}`;

    return this.http.delete(url)
      .pipe(
        map((res: any) => {
          const boletoEliminado: Boleto = new Boleto();
          boletoEliminado.fromJson(res.boleto);
          return boletoEliminado;
        }),
        catchError(err => throwError(err))
      );
  } // eliminar

  // -------------------------------------------------------------------
  // Obtener listado de boletos
  // -------------------------------------------------------------------
  cargarTodos(filtros: any = {}, pagina: number = 0, paginaSize: number = 0): Observable<IResponseBoleto> {
    const url: string = `${this.path}all/${pagina}/${paginaSize}`
    return this.http.post(url, filtros)
      .pipe(
        map((res: any) => this.toResposeBoleto(res)),
        catchError(err => throwError(err))
      );
  } // cargarTodos


  /**
   * @method eliminarBoletos
   * @param {any} filtros Filtros de eliminacion
   * @return {Observable<any>}
   */
  eliminarBoletos(filtros: any = {}): Observable<number> {
    const url: string = `${this.path}delete_many`
    return this.http.post(url, filtros)
      .pipe(
        map(({ eliminados }: any) => eliminados),
        catchError(err => throwError(err))
      );
  }


  /**
   * @method reporte
   * @description Obtiene un reporte de los boletos
   * @param {string} filtros Filtro de los boletos a obtener
   * @param {number} pagina Pagina actual
   * @param {number} paginaSize Tamanio de la pagina
   * @return {Observable<any>}
   */
  reporte(filtros: any = {}, pagina: number = 0, paginaSize: number = 0): Observable<any> {
    const url: string = `${this.path}report/${pagina}/${paginaSize}`
    return this.http.post(url, filtros)
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  } // reporte


  // -------------------------------------------------------------------
  // Convierte una respuesta de resultados en objetos e interfaces
  // -------------------------------------------------------------------
  private toResposeBoleto(res: any): IResponseBoleto {
    return {
      ok: res.ok,
      boletos: res.boletos.map(boleto => new Boleto().fromJson(boleto)),
      pag_anterior: res.pag_anterior,
      pag_actual: res.pag_actual,
      total_paginas: res.total_paginas,
      total_registros: res.total_registros
    };
  } // toResposeBoleto



  // -------------------------------------------------------------------
  // Obtener listado de boletos
  // -------------------------------------------------------------------
  obtenerBoleto(fecha: Date, hora: string, carril: number, folio: string): Observable<Boleto> {
    const fechaParam = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
    const url: string = `${this.path}load/${fechaParam}/${hora}/${carril}/${folio}`

    return this.http.get(url)
      .pipe(
        map((res: any) => {
          const boleto: Boleto = new Boleto();
          boleto.fromJson(res.boleto);
          return boleto;
        }),
        catchError(err => throwError(err))
      );
  } // cargarTodos


  toXLS(json: any[], name: string = 'archivo.xlsx'): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
    saveAs(data, name);
  }

  /**
   * @method cargarListaUsos
   * @autor Malcolm
   */
  getTipos(): TipoImport[]{
    return this.tiposImport;
  }





}

/**
 * @author Hugo Gionori Soto Miguel
 * @version 2.0.0
 *
 * history
 * v.2.0.0 - Se agrego la carga de factura desde la base de datos
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators'
import {throwError, Observable} from 'rxjs';
import {saveAs} from 'file-saver';

// Configuracion
import * as config from '../config/config';

// Servicios
import {UsuariosService} from './usuarios.service';

// Clases
import {Boleto} from '../classes/class.boleto';
import ISesion from '../classes/interface.sesion';
import {Factura} from '../classes/interface.factura';
import {InternalPayment} from "../classes/interface.facturapi";

//modelos
import {Usos, RegimenFiscal} from '../models/usos.model';


@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  path: string = `${config.URL_SERVICES}/facturas/`;

  //datos
  usos: Usos []= [
    {value: 'G01', desc: 'Adquisición de mercancías.'},
    {value: 'G02', desc: 'Devoluciones, descuentos o bonificaciones.'},
    {value: 'G03', desc: 'Gastos en general.'},
    {value: 'I01', desc: 'Construcciones.	'},
    {value: 'I02', desc: 'Mobiliario y equipo de oficina por inversiones.	'},
    {value: 'I03', desc: 'Equipo de transporte.	'},
    {value: 'I04', desc: 'Equipo de computo y accesorios.	'},
    {value: 'I05', desc: 'Dados, troqueles, moldes, matrices y herramental.	'},
    {value: 'I06', desc: 'Comunicaciones telefónicas.	'},
    {value: 'I07', desc: 'Comunicaciones satelitales.	'},
    {value: 'I08', desc: 'Otra maquinaria y equipo.	'},
    {value: 'D01', desc: 'Honorarios médicos, dentales y gastos hospitalarios.'},
    {value: 'D02', desc: 'Gastos médicos por incapacidad o discapacidad.'},
    {value: 'D03', desc: 'Gastos funerales.	'},
    {value: 'D04', desc: 'Donativos.'},
    {value: 'D05', desc: 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).'},
    {value: 'D06', desc: 'Aportaciones voluntarias al SAR.'},
    {value: 'D07', desc: 'Primas por seguros de gastos médicos.'},
    {value: 'D08', desc: 'Gastos de transportación escolar obligatoria.'},
    {value: 'D09', desc: 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.	'},
    {value: 'D10', desc: 'Pagos por servicios educativos (colegiaturas).'},
    {value: 'S01', desc: 'Sin efectos fiscales.'},
    {value: 'CP01', desc: 'Pagos.'},
    {value: 'CN01', desc: 'Nómina.'}
  ];

  regimenFiscal: RegimenFiscal[] = [
    {value: '601', desc: 'General de Ley Personas Morales'},
    {value: '603', desc: 'Personas Morales con Fines no Lucrativos'},
    {value: '605', desc: 'Sueldos y Salarios e Ingresos Asimilados a Salarios'},
    {value: '606', desc: 'Arrendamiento'},
    {value: '608', desc: 'Demás ingresos'},
    {value: '609', desc: 'Consolidación'},
    {value: '610', desc: 'Residentes en el Extranjero sin Establecimiento Permanente en México'},
    {value: '611', desc: 'Ingresos por Dividendos (socios y accionistas)'},
    {value: '612', desc: 'Personas Físicas con Actividades Empresariales y Profesionales'},
    {value: '614', desc: 'Ingresos por intereses'},
    {value: '616', desc: 'Sin obligaciones fiscales'},
    {value: '620', desc: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos'},
    {value: '621', desc: 'Incorporación Fiscal'},
    {value: '622', desc: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'},
    {value: '623', desc: 'Opcional para Grupos de Sociedades'},
    {value: '624', desc: 'Coordinados'},
    {value: '628', desc: 'Hidrocarburos'},
    {value: '607', desc: 'Régimen de Enajenación o Adquisición de Bienes'},
    {value: '629', desc: 'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales'},
    {value: '630', desc: 'Enajenación de acciones en bolsa de valores'},
    {value: '615', desc: 'Régimen de los ingresos por obtención de premios'},
    {value: '625', desc: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'},
    {value: '626', desc: 'Régimen Simplificado de Confianza'},
  ];

  // -------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------
  constructor(private http: HttpClient,
              private _usuariosService: UsuariosService) {
  } // constructor


  /**
   * @method facturarComplemento
   * @param {any} payment Data del complemento a facturar
   * @param rfcId
   * @returns {Observable<any>}
   */
  facturarPago(payment: any, rfcId: any): Observable<any> {
    return this.http.post(`${this.path}facturar_pago`, {payment, rfcId})
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  }


  /**
   * @method obtenerComplementos
   * @param {string} uuid UUID de la factura a mostrar sus complementos
   * @returns {Observable<any[]>}
   */
  obtenerPagos(uuid: string): Observable<InternalPayment[]> {
    return this.http.get(`${this.path}pagos/${uuid}`)
      .pipe(
        map((res: any) => res.pagos),
        catchError(err => throwError(err))
      );
  }


  /**
   * @method cargarPorFolio
   * @param {string} folio Numero de folio de la factura
   * @returns {Observable<Factura>}
   */
  cargarPorFolio(series: string, folio_number: string): Observable<Factura> {
    return this.http.get(`${this.path}folio/${series}/${folio_number}`)
      .pipe(
        map((res: any) => res.factura),
        catchError(err => throwError(err))
      );
  }


  // -------------------------------------------------------------------
  // Timbrar una factura
  // -------------------------------------------------------------------
  facturar(factura: Factura, boletos: Boleto[]) {
    // Generamos la request para facturapi
    let items: any[] = [];
    boletos.forEach(boleto => items.push(boleto.toJson()));

    const req: any = {
      factura: factura,
      boletos: items
    };

    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.post(`${this.path}facturar`, req, headers)
      .pipe(
        map((res: any) => res.factura),
        catchError(err => throwError(err))
      );
  } // timbrar


  // -------------------------------------------------------------------
  // Timbrar una factura mensual
  // -------------------------------------------------------------------
  facturarGlobal(factura: Factura, filtros: any = {}): Observable<Factura> {
    return this.http.post(`${this.path}facturar_global`, {factura, filtros})
      .pipe(
        map((res: any) => res.factura),
        catchError(err => throwError(err))
      );
  } // timbrar


  // -------------------------------------------------------------------
  // Obtener todas las facturas
  // -------------------------------------------------------------------
  cargarTodas(filtros: any = {}, page: number = 0, limit: number = 0) {
    return this.http.post(`${this.path}all/${page}/${limit}`, filtros)
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  } // obtenerFacturas


  // -------------------------------------------------------------------
  // Descargar la factura en PDF
  // -------------------------------------------------------------------
  descargar(id_facturapi: string, formato: string = 'pdf') {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = new HttpHeaders().set('X-API-KEY', sesion.token);
    const url: string = `${this.path}download/${formato}/${id_facturapi}`;

    return this.http.get(url, {responseType: 'blob', headers})
      .pipe(
        map((res: any) => saveAs(res, `Factura.${formato}`)),
        catchError(err => throwError(err))
      );
  } // descargar


  // -------------------------------------------------------------------
  // Envia la factura por correo electrónico
  // -------------------------------------------------------------------
  enviarEmail(factura: any) {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};
    const url: string = `${this.path}send/${factura.id}`;

    return this.http.get(url, headers)
      .pipe(
        map((res: any) => res),
        catchError(err => throwError(err))
      );
  } // obtenerFacturas


  // -------------------------------------------------------------------
  // Cancela una factura
  // -------------------------------------------------------------------


  cancelar(cancelData: any) {debugger
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.post(`${this.path}cancel/`, cancelData, headers)
      .pipe(
        map((res: any) => res.factura),
        catchError(err => throwError(err))
      );
  } // cancelar

  // -------------------------------------------------------------------
  // Obtiene una factura
  // -------------------------------------------------------------------
  cargar(id_facturapi: string) {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = {headers: {'X-API-KEY': sesion.token}};

    return this.http.get(`${this.path}load/${id_facturapi}`, headers)
      .pipe(
        map((res: any) => res.factura),
        catchError(err => throwError(err))
      );
  } // cargar

  // -------------------------------------------------------------------
  // Descargar la factura en PDF
  // -------------------------------------------------------------------
  obtenerUsos() {
    const url: string = `${this.path}usos`;

    return this.http.get(url)
      .pipe(
        map((usos: any) => usos),
        catchError(err => throwError(err))
      );
  } // descargar


  /**
   * @method descargarFacturas Descarga un grupo de facturas
   * @param filtros Filtro para descargar facturas
   * @param page    pagina actual
   * @param limit   tamaño de la página actual
   * @returns {Observable}
   */
  descargarFacturas(filtros: any = {}, page: number = 0, limit: number = 0) {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    const headers = new HttpHeaders().set('X-API-KEY', sesion.token);

    const url: string = `${this.path}zip/${page}/${limit}`;

    return this.http.post(url, filtros, {responseType: 'blob', headers})
      .pipe(
        map((res: any) => saveAs(res, 'facturas.zip')),
        catchError(err => throwError(err))
      );
  } // descargarFacturas


  /**
   * @method cargarListaUsos
   */
   getUsos_list(): Usos[]{
    return this.usos;
  }

  /**
   * @method cargarListaRegimenFiscal
   */
   getRegimenFiscal_list(): Usos[]{
    return this.regimenFiscal;
  }

}

/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Clase de utilidades para la gestion de boletos
 */

import * as XLSX from 'xlsx';
import moment from 'moment';
import { IImportacion } from '../../classes/interface.importacion';
import { Tarifa } from '../tarifa';

 /**
  * @class TicketUtils
  * @description Contiene utilidades para operaciones con boletos
  */
export class TicketUtils {

  /**
   * @method importarXLS
   * @param archivo Archivo a importar
   * @param config Configuracion de la importacion
   * @returns 
   */
  static importartXLS(archivo: File, config: any, tarifas?: Tarifa[]): Promise<IImportacion> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      let importacion: IImportacion = { data: [], file: archivo };
        
      // Preparamos el evento para la carga del archivo
      reader.onload = (e: any) => {
        // Leemos el libro
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    
        // Obtenemos la primera hoja
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    
        // Obtenemos la data del excel
        importacion.data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });  
        
        // Obtenemos el numero de carril
        importacion.carril = importacion.data.length >= 9 ? importacion.data[8][5] : null; 

        // Obtenemos la configuracion
        const { filaInicial, fecha, hora, carril, senal, tarifa, pago, folio } = config;
        
        // Eliminamos filas vacias y solo tomamos filas con boletos
        importacion.data.splice(0, filaInicial - 1);

        // Obtenemos boletos en JSON, el ciclo se corta cuando encuentra la primer fila vacia
        let temporal: any[] = [];
        for (let i: number = 0; i < importacion.data.length; i++) {

          let value: number;
          if (tarifas && importacion.data[i].length > 0) {
            // IAVE y TAG
            value = tarifas.find(t => t.id.trim() === importacion.data[i][senal])?.value;
            if (!value) {
              reject(`No se encontro ${importacion.data[i][senal]} en fila ${i + 1}`);
            }            
          } else {
            // NOR y CRE
            value = importacion.data[i][tarifa];
          }

          if (importacion.data[i].length > 0) {
            temporal.push({
              fecha     : moment(importacion.data[i][fecha], 'DD-MM-YY'),
              hora      : importacion.data[i][hora],
              carril    : importacion.carril || importacion.data[i][carril],
              senal     : importacion.data[i][senal],
              tarifa    : value,
              pago      : importacion.data[i][pago],
              folio     : importacion.data[i][folio]
            });
          } else {
            break;
          }
        } // for
        importacion.data = [...temporal];

        importacion.message = 'Preparado para importar';
        resolve(importacion);        
      };
  
      reader.readAsBinaryString(archivo);
    }); // promesa
  } // cvsToJson

}


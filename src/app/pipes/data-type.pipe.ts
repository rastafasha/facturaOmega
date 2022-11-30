/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Formate la data segun su tipo de dato
 */
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'datatype'
})
export class DataTypePipe implements PipeTransform {
  transform(data): string {    
    if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object') {
      if(data instanceof moment) {
        return moment(data).format('DD/MM/yyyy');
      }
      if(data instanceof Date) {
        return moment(data).format('DD/MM/yyyy');
      }
      return data;
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

// Clases
import RFC from '../classes/class.rfc';

@Pipe({
  name: 'rfc'
})
export class RfcPipe implements PipeTransform {

  transform(rfc: RFC | any): string {
    if (rfc.tipo === RFC.PERSONA_FISICA) {
      return `${rfc.nombres} ${rfc.apellidos}`;
    } else {
      return rfc.razon_social;
    }
  }

}

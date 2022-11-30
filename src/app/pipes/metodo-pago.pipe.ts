import { Pipe, PipeTransform } from '@angular/core';

import { METODOS_PAGO } from '../data/catalogos';

@Pipe({
  name: 'metodoPago'
})
export class MetodoPagoPipe implements PipeTransform {

  transform(payment_method: string): string {
    return METODOS_PAGO.find(mp => mp.id === payment_method)?.nombre;
  }

}

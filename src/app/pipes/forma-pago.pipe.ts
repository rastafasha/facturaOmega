import { Pipe, PipeTransform } from '@angular/core';

import { FORMAS_PAGO } from '../data/catalogos';

@Pipe({
  name: 'formaPago'
})
export class FormaPagoPipe implements PipeTransform {

  transform(payment_form: string): string {
    return FORMAS_PAGO.find(fp => fp.id === payment_form)?.nombre;
  }

}

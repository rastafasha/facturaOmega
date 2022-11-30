import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFactura'
})
export class StatusFacturaPipe implements PipeTransform {

  transform(factura: any): string {
    if (factura.status === 'canceled') {
      return 'Cancelada';
    } else if (factura.status === 'valid') {
      if (factura.cancellation_status === 'pending') {
        return 'En espera';
      } else {
        return 'Aprobada';
      }

    }
  }

}

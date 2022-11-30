import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'folioBoleto'
})
export class FolioBoletoPipe implements PipeTransform {

  transform(folio: string): string {    
    if (folio === '' || folio === '0') {
      return 'Sin folio';
    } else {
      return folio;
    }
  }

}

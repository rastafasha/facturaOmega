import { Pipe, PipeTransform } from '@angular/core';

import { USOS } from '../data/catalogos';


@Pipe({
  name: 'formaUso'
})
export class FormaUsoPipe implements PipeTransform {

  transform(use: string): string {
    return USOS.find(u => u.id === use)?.nombre;
  }

}

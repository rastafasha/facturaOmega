import { Pipe, PipeTransform } from '@angular/core';

// Clases
import Usuario from '../classes/class.usuario';

@Pipe({
  name: 'perfil'
})
export class PerfilPipe implements PipeTransform {

  transform(perfil: number): string {
    switch (perfil) {
      case Usuario.ADMINISTRADOR : return 'Administrador';
      case Usuario.CAPTURISTA    : return 'Capturista';
      case Usuario.CLIENTE       : return 'Cliente';
      default                    : return 'Desconocido'
    }
  }

}

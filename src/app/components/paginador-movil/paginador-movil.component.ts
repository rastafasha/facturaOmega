import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-paginador-movil',
  templateUrl: './paginador-movil.component.html',
  styles: [
  ]
})
export class PaginadorMovilComponent {

  @Output() onChange: EventEmitter<number> = new EventEmitter();
  @Input() pagina: number;
  @Input() totalRegistros: number;
  @Input() totalPorPagina: number;
  @Input() disabled: boolean;

  siguiente(): void {
    this.pagina += 1;
    this.onChange.emit(this.pagina);
  }

  atras(): void {
    this.pagina -= 1;
    this.onChange.emit(this.pagina);
  }

  esSiguienteValido(): boolean {
    const tope: number = Math.ceil(this.totalRegistros / this.totalPorPagina);
    return (this.pagina + 1) < tope;
  }

}

import { Injectable, Output, EventEmitter } from '@angular/core';

// clases
import RFC from '../classes/class.rfc';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  @Output() changeRFCs: EventEmitter<RFC[]> = new EventEmitter();
  @Output() selectedRFC: EventEmitter<RFC> = new EventEmitter();
  @Output() openedFiltro: EventEmitter<any[]> = new EventEmitter();
  @Output() filtered: EventEmitter<any> = new EventEmitter();


  // Informa los cambios en el listado de RFC's
  emmitRFCs(rfcs: RFC[]): void {
    this.changeRFCs.emit(rfcs);
  } // emmitRFCs

  // Informa cuando un RFC ha sido seleccionado en el header
  selectRFC(rfc: RFC): void {
    this.selectedRFC.emit(rfc);
  } // emmitRFCs


  // Informa cuando el filtro abre/cierra
  openFiltro(filtros: any[]): void {
    this.openedFiltro.emit(filtros);
  } // openFiltro


  // Informa cuando el filtro ha sido ejecutado
  onFilter(filtros: any): void {
    this.filtered.emit(filtros);
  } // onFilter
}

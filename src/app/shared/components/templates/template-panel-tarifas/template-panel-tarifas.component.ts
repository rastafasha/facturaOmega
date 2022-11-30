/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @description Plantilla para el panel de tarifas
 */
import {
  Component,
  Input,
  EventEmitter,
  Output
} from '@angular/core';

// Clases
import { Tarifa } from '../../../../classes/tarifa';

@Component({
  selector: 'template-panel-tarifas',
  templateUrl: './template-panel-tarifas.component.html',
  styles: [
  ]
})
export class TemplatePanelTarifasComponent {

  /**
   * @property
   * @description Tarifas a mostrar
   * @type {Tarifa[]}
   */
  @Input() tarifas: Tarifa[] = [];

  /**
   * @property
   * @description Titulo de la pagina
   * @type {string}
   */
  @Input() title: string = 'Tarifas';

  /**
   * @property
   * @description Bandera de carga
   * @type {boolean}
   */
  @Input() loading: boolean;

  /**
   * @property
   * @type {EventEmitter<void>}
   * @description Emisor de evento de creacion
   */
  @Output() onCreate: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @property
   * @type {EventEmitter<Tarifa>}
   * @description Emisor de evento de actualizacion
   */
  @Output() onUpdate: EventEmitter<Tarifa> = new EventEmitter<Tarifa>();

  /**
   * @property
   * @type {EventEmitter<Tarifa>}
   * @description Emisor de evento de eliminacion
   */
   @Output() onDelete: EventEmitter<Tarifa> = new EventEmitter<Tarifa>();


  handleNew(): void {
    this.onCreate.emit();
  }

  /**
   * @method handleUpdate
   * @description Dispara evento de actualizacion
   */
   handleUpdate(tarifa: Tarifa): void {
    this.onUpdate.emit(tarifa);
  }

  /**
   * @method handleDelete
   * @description Dispara evento de eliminacion
   */
  handleDelete(tarifa: Tarifa): void {
    this.onDelete.emit(tarifa);
  }

}

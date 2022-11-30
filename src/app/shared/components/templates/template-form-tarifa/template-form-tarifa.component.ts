/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Plantilla para operaciones con tarifas
 */
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

// Classes
import { Tarifa } from '../../../../classes/tarifa';

@Component({
  selector: 'template-form-tarifa',
  templateUrl: './template-form-tarifa.component.html',
  styles: [
  ]
})
export class TemplateFormTarifaComponent {

  /**
   * @property
   * @type {string}
   * @description Titulo del formulario
   */
  @Input() title: string = 'Formulario Tarifa';

  /**
   * @property
   * @type {boolean}
   * @description Bandera de carga
   */
  @Input() loading: boolean;

  /**
   * @property
   * @type {Tarifa}
   * @description Objeto encapsulador
   */
  @Input() tarifa: Tarifa = new Tarifa();

  /**
   * @property
   * @type {EventEmitter<Tarifa>}
   * @description Emisor de evento de cometido
   */
  @Output() onSubmit: EventEmitter<Tarifa> = new  EventEmitter<Tarifa>();

  /**
   * @property
   * @type {EventEmitter<void>}
   * @description Emisor de evento de cancelacion
   */
  @Output() onCancel: EventEmitter<void> = new  EventEmitter<void>();

  /**
   * @method handleSubmit
   * @param tarifa Tarifa encapsulada por el organismo
   */
  handleSubmit(tarifa: Tarifa): void {
    this.onSubmit.emit(tarifa);    
  }

  /**
   * @method handleCancel
   * @param tarifa Tarifa encapsulada por el organismo
   */
   handleCancel(): void {
    this.onCancel.emit();    
  }

}

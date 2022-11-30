/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Formulario de una tarifa
 */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

// Utilerias
import { StandardErrorStateMatcher } from '../../../../utils/cchsforms';

// Clases
import { Tarifa } from '../../../../classes/tarifa';

@Component({
  selector: 'organism-form-tarifa',
  templateUrl: './form-tarifa.component.html',
  styleUrls: []
})
export class FormTarifaComponent implements OnInit, OnChanges {

  /**
   * @property
   * @type {FormGroup}
   * @description Gestor del formulario
   */
  form: FormGroup;

  /**
   * @property
   * @type {StandardErrorStateMatcher}
   * @description Gestor de las validaciones de error en el formulario
   */
  matcher: StandardErrorStateMatcher = new StandardErrorStateMatcher();
  
  /**
   * @property
   * @type {boolean}
   * @description Gestiona la inhabilitacion del formulario
   */
  @Input() loading: boolean;

  /**
   * @property
   * @type {Tarifa}
   * @description Encapsulador de la informacion
   */
  @Input() tarifa: Tarifa = new Tarifa();

  /**
   * @property
   * @type {EventEmitter<Tarifa>}
   * @description Emisor de evento de submit del formulario
   */
  @Output() onSubmit: EventEmitter<Tarifa> = new EventEmitter<Tarifa>();

  /**
   * @property
   * @type {EventEmitter<void>}
   * @description Emisor de evento de cancelacion
   */
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  
  /**
   * @constructor
   * @description Inyeccion de componentes
   * @param formBuilder Constructor del formulario
   * @param changeDetectorRef Deteccion de cambios en el formulario
   */
  constructor(private formBuilder: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef) {}

  /**
   * @method ngOnInit
   * @description Inicializacion del componente
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'id': [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)]
      ],
      'valor': [null, [
        Validators.required,
        Validators.min(1)
      ]]      
    });
  } // ngOnInit

  
  /**
   * @method ngOnChanges
   * @description Gestionamos los cambios de estado de carga del formulario
   * @description El cambio de estado solo ocurre si loading ha cambiado su estado
   * @param changes Cambios ocurridos en el ciclo de vida del componente
   */
  ngOnChanges(changes: SimpleChanges): void { 
    const loadingPrevio: boolean = !!changes.loading?.previousValue;
    const loadingActual: boolean = !!changes.loading?.currentValue;

    const tarifaPrevio: Tarifa = changes.tarifa?.previousValue;
    const tarifaActual: Tarifa = changes.tarifa?.currentValue;

    if(this.tarifa && this.form && tarifaPrevio !== tarifaActual) {
      this.form.get('id').setValue(this.tarifa.id);
      this.form.get('valor').setValue(this.tarifa.value);
      this.changeDetectorRef.detectChanges();
    }    
    
    if (this.form && loadingPrevio !== loadingActual ) {
      if (this.loading) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }


  /**
   * @method submit
   * @description Submit del formulario
   */
  handleSubmit(): void {
    let tarifaSubmit: Tarifa = new Tarifa();
    tarifaSubmit.id = this.form.get('id').value;
    tarifaSubmit.value = this.form.get('valor').value;

    this.onSubmit.emit(tarifaSubmit);    
  }

  /**
   * @method cancel
   * @description Cancelar operacion
   */
   handleCancel(): void {
    this.onCancel.emit();    
  }

}

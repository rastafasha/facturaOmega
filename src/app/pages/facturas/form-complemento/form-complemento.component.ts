/**
 * @author Hugo Gionori Soto Muguel
 * @version 1.0.0.
 */
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {StandardErrorStateMatcher} from '../../../utils/cchsforms';


import {Factura} from 'src/app/classes/interface.factura';


@Component({
  selector: 'app-form-complemento',
  templateUrl: './form-complemento.component.html',
  styles: []
})
export class FormComplementoComponent implements OnInit {

  /**
   * @property
   * @type {boolean}
   */
  loading: boolean;

  /**
   * @property
   * @type {FormGroup}
   */
  form: FormGroup;

  /**
   * @property
   * @type {StandardErrorStateMatcher}
   */
  matcher: StandardErrorStateMatcher = new StandardErrorStateMatcher();


  mask = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];


  factura: Factura;

  parcialidad: number;

  balance: number;


  /**
   * @constructor
   */
  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<FormComplementoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.factura = this.data.factura_global;
    this.parcialidad = this.data.parcialidad;
    this.balance = this.data.balance;
  }


  /**
   * @method ngOnInit
   * @description Inicialización de componentes
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      forma_pago: [null, [Validators.required]],
      fecha: [null, [Validators.required]],
      monto: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.balance)
      ]]
    });
  }


  /**
   * @method handleSubmit
   * @description Submit del formulario
   */
  handleSubmit(): void {
    const data: any = {
      type: 'P',
      customer: this.factura.customer.id,
      // customer
      payments: [{
        payment_form: this.form.get('forma_pago').value,
        date: this.form.get('fecha').value,
        related: [{
          uuid: this.factura.uuid,
          amount: this.form.get('monto').value,
          installment: this.parcialidad,
          last_balance: this.balance
        }]
      }]
    };
    this.dialogRef.close(data);
  }


  /**
   * @method handleCancel
   * @description Cancelar operaciones con el formulario
   */
  handleCancel(): void {
    this.dialogRef.close(null);
  }

}

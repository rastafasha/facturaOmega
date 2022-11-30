import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


// Utilerias
import { StandardErrorStateMatcher } from '../../../utils/cchsforms';
import moment from 'moment';

// Servicios
import { MessagesService } from '../../../services/messages.service';
import { BoletosService } from 'src/app/services/boletos.service';

// Clases
import Usuario from '../../../classes/class.usuario';
import { Boleto } from 'src/app/classes/class.boleto';

// Catálogos
import { SENALES, TIPOS_PAGO } from '../../../data/catalogos';

@Component({
  selector: 'app-form-boleto',
  templateUrl: './form-boleto.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class FormBoletoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean;
  matcher = new StandardErrorStateMatcher();

  boletosSubscripcion: Subscription = new Subscription();

  usuarioSesion: Usuario;
  boleto: Boleto;
  fechaAnterior: string;
  horaAnterior: string;
  carrilAnterior: number;
  folioAnterior: string;

  mask = [/\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];

  SENALES = SENALES;
  PAGOS = TIPOS_PAGO;

  // -------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------
  constructor(private formBuilder: FormBuilder,
              private _messagesService: MessagesService,
              private _boletosService: BoletosService,
              private dialogRef: MatDialogRef<FormBoletoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.boleto = data.boleto;
  } // constructor

  // -------------------------------------------------------------------
  // Inicialización del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecha   : [null, Validators.required],
      hora    : [null, Validators.required],
      carril  : [null, [Validators.required, Validators.min(1)]],
      senal   : [null, [Validators.required, Validators.maxLength(20)]],
      tarifa  : [null, [Validators.required, Validators.maxLength(200)]],
      pago    : [null, [Validators.minLength(2), Validators.maxLength(3)]],
      folio   : [null, [Validators.required, Validators.maxLength(20)]]
    });

    if (this.boleto) {
      const fecha: moment.Moment = moment(this.boleto.fecha);
      this.fechaAnterior = `${fecha.year()}-${fecha.month() + 1}-${fecha.date()}`;
      this.horaAnterior = this.boleto.hora;
      this.carrilAnterior = this.boleto.carril;
      this.folioAnterior = this.boleto.folio;

      this.form.get('fecha').setValue(fecha);
      this.form.get('hora').setValue(this.boleto.hora);
      this.form.get('carril').setValue(this.boleto.carril);
      this.form.get('senal').setValue(this.boleto.senal);
      this.form.get('tarifa').setValue(this.boleto.tarifa);
      this.form.get('pago').setValue(this.boleto.pago);
      this.form.get('folio').setValue(this.boleto.folio);
    }
  } // ngOnInit


  // -------------------------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------------------------
  ngOnDestroy(): void {
    this.boletosSubscripcion.unsubscribe();
  } // onDestroy


  // -------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------
  submit(): void {
    const boleto: Boleto = this.boleto || new Boleto();
    boleto.hora    =  this.form.get('hora').value;
    boleto.carril  =  this.form.get('carril').value;
    boleto.senal   =  this.form.get('senal').value;
    boleto.tarifa  =  this.form.get('tarifa').value;
    boleto.pago    =  this.form.get('pago').value;
    boleto.folio   =  this.form.get('folio').value;
    const fecha: moment.Moment = this.form.get('fecha').value;
    boleto.fecha = fecha.toDate();

    this.loading = true;
    this.form.disable();
    let accion: Observable<any>;
    if (!this.boleto) {
      accion = this._boletosService.guardar(boleto);
    } else {
      accion = this._boletosService.actualizar(
        boleto, this.fechaAnterior,
        this.horaAnterior,
        this.carrilAnterior,
        this.folioAnterior
      );
    }

    this.boletosSubscripcion = accion.subscribe(boleto => {
        this.loading = false;
        this.form.enable();
        this.dialogRef.close(boleto);

      }, err => {
        this.loading = false;
        this.form.enable();

        // bandera para actualizacion del boleto
        if (err.status == 404) {
          // En teoria no ocurrio un error, realmente el backend tiene problemas
          // con cargar boleto actualizado
          this.dialogRef.close(boleto);
        } else {
          // Sí ocurrió un error
          this._messagesService.error(err);
        }
      });
  } // submit

}

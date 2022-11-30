import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';

// Utilerias
import {StandardErrorStateMatcher} from '../../../utils/cchsforms';

// Servicios
import {UsuariosService} from '../../../services/usuarios.service';
import {RfcsService} from '../../../services/rfcs.service';
import {MessagesService} from '../../../services/messages.service';

// Clases
import Usuario from '../../../classes/class.usuario';
import RFC from '../../../classes/class.rfc';

// Configuracion
import * as config from '../../../config/config';
import ISesion from '../../../classes/interface.sesion';
import {Address} from '../../../classes/class.address';


//modelos
import { Usos, RegimenFiscal } from 'src/app/models/usos.model';
import { FacturasService } from 'src/app/services/facturas.service';


@Component({
  selector: 'app-form-rfc',
  templateUrl: './form-rfc.component.html',
  styles: []
})
export class FormRfcComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean;
  matcher = new StandardErrorStateMatcher();

  rfcsServiceSubscripcion: Subscription = new Subscription();
  sessionUpdatedSubscription: Subscription = new Subscription();

  rfc: RFC;
  sesion: ISesion;

  regimenFiscal: RegimenFiscal[] = []

  // Constantes
  readonly PERSONA_FISICA: number = RFC.PERSONA_FISICA;
  readonly PERSONA_MORAL: number = RFC.PERSONA_MORAL;


  // -------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------
  constructor(private formBuilder: FormBuilder,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService,
              private _rfcsServices: RfcsService,
              private _facturasService: FacturasService,
              private dialogRef: MatDialogRef<FormRfcComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.sesion = this._usuariosService.obtenerSesion();
    this.rfc = data.rfc;
  } // constructor

  // -------------------------------------------------------------------
  // Inicialización del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    this.sessionUpdatedSubscription = this._usuariosService.sessionUpdated
      .subscribe((session: any) => {
        this.sesion = session;
      });

    this.form = this.formBuilder.group({
      rfc: [null, [Validators.required, Validators.pattern(config.REG_EXP_RFC)]],
      tipo: [this.PERSONA_FISICA, Validators.required],
      razon_social: null,
      nombres: null,
      apellidos: null,
      email: [null, [Validators.required, Validators.email, Validators.maxLength(200)]],
      tax_system: [null, [Validators.required]],
      telefono: [null, [Validators.maxLength(10)]],
      address_zip: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    });

    this.cambiarTipo(this.rfc && this.rfc.id ? this.rfc.tipo : this.PERSONA_FISICA);

    if (this.rfc && this.rfc.id) {
      // Si es actualizacion proponemos valores del RFC enviado como parametro
      this.form.get('rfc').setValue(this.rfc.clave);
      this.form.get('email').setValue(this.rfc.email);
      this.form.get('telefono').setValue(this.rfc.telefono);
      this.form.get('tipo').setValue(this.rfc.tipo);
      if (this.form.get('tipo').value === this.PERSONA_FISICA) {
        this.form.get('nombres').setValue(this.rfc.nombres);
        this.form.get('apellidos').setValue(this.rfc.apellidos);
      } else {
        this.form.get('razon_social').setValue(this.rfc.razon_social);
      }
      this.form.get('tax_system').setValue(this.rfc.tax_system);
      this.form.get('address_zip').setValue(this.rfc.address.zip || '');
    }

    this.loadRegimenFiscalList();
  } // ngOnInit


  // -------------------------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------------------------
  ngOnDestroy(): void {
    this.rfcsServiceSubscripcion.unsubscribe();
    this.sessionUpdatedSubscription.unsubscribe();
  } // onDestroy


  //carga regimenfiscal desde la app//
  loadRegimenFiscalList(): void{
    this.regimenFiscal = this._facturasService.getRegimenFiscal_list()
    console.log(this.regimenFiscal);

  }


  // -------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------
  submit(): void {
    const rfc: RFC = this.rfc || new RFC('', '', '', new Address());
    rfc.clave = this.form.get('rfc').value;
    rfc.tipo = this.form.get('tipo').value;
    rfc.email = this.form.get('email').value;
    rfc.telefono = this.form.get('telefono').value;
    if (this.form.get('tipo').value === this.PERSONA_FISICA) {
      rfc.nombres = this.form.get('nombres').value;
      rfc.apellidos = this.form.get('apellidos').value;
      rfc.razon_social = null;
    } else {
      rfc.nombres = null;
      rfc.apellidos = null;
      rfc.razon_social = this.form.get('razon_social').value;
    }
    rfc.tax_system = this.form.get('tax_system').value;
    rfc.address.zip = this.form.get('address_zip').value;
    this.loading = true;
    this.form.disable();
    let accion: Observable<any>;
    if (!rfc.id) {
      accion = this._rfcsServices.guardar(rfc);
    } else {
      accion = this._rfcsServices.actualizar(rfc);
    }

    this.rfcsServiceSubscripcion = accion.subscribe(rfc => {
      this.loading = false;
      this.form.enable();
      if (this.sesion.rfc.id === rfc.id) {
        this.sesion.rfc = rfc;
        this._usuariosService.guardarSesion(this.sesion);
      }
      this.dialogRef.close(rfc);
    }, err => {
      this.loading = false;
      this.form.enable();
      this._messagesService.error(err);
    });
  } // submit


  // -------------------------------------------------------------------
  // Accion al cambiar un tipo de contribuyente
  // -------------------------------------------------------------------
  cambiarTipo(tipo: number): void {
    console.log(tipo);
    if (tipo === RFC.PERSONA_MORAL) {
      this.form.get('razon_social').setValidators([Validators.required, Validators.maxLength(200)]);
      this.form.get('nombres').clearValidators();
      this.form.get('apellidos').clearValidators();
      this.form.get('nombres').setValue(null);
      this.form.get('apellidos').setValue(null);
    } else {
      this.form.get('nombres').setValidators([Validators.required, Validators.maxLength(200)]);
      this.form.get('apellidos').setValidators([Validators.required, Validators.maxLength(200)]);
      this.form.get('razon_social').clearValidators();
      this.form.get('razon_social').setValue(null);
    }
    this.form.get('nombres').updateValueAndValidity();
    this.form.get('apellidos').updateValueAndValidity();
    this.form.get('razon_social').updateValueAndValidity();
    this.form.updateValueAndValidity();
  } // cambiarTipo
}

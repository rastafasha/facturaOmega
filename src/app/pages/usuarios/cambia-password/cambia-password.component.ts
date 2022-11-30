import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

// Servicios
import {MessagesService} from 'src/app/services/messages.service';
import {UsuariosService} from 'src/app/services/usuarios.service';

// Utilerias
import {StandardErrorStateMatcher, passwordIgualValidator} from '../../../utils/cchsforms';

// Configuracion
import * as config from '../../../config/config';


@Component({
  selector: 'app-cambia-password',
  templateUrl: './cambia-password.component.html',
  styles: []
})
export class CambiaPasswordComponent implements OnInit, OnDestroy {
  hidePassword = true;
  hidePasswordConfirm = true;
  loading: boolean;
  form: FormGroup;
  matcher = new StandardErrorStateMatcher();

  subscripcion: Subscription = new Subscription();

  // ---------------------------------------------------
  // Constructor
  // ---------------------------------------------------
  constructor(private fb: FormBuilder,
              private _messageServices: MessagesService,
              private _usuariosServices: UsuariosService) {
  }


  // ---------------------------------------------------
  // Inicializacion del componente
  // ---------------------------------------------------
  ngOnInit(): void {
    this.form = this.fb.group({
      'password': [null, [Validators.required, Validators.pattern(new RegExp(config.REG_EXP_PASSWORD)), Validators.minLength(8), Validators.maxLength(10)]],
      'confirma': [null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), passwordIgualValidator('password')]]
    });
  }


  // ---------------------------------------------------
  // Destruccion del componente
  // ---------------------------------------------------
  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }


  // ---------------------------------------------------
  // Ejecucion del cambio de contraseña
  // ---------------------------------------------------
  submit(): void {
    this.loading = true;
    this.form.disable();

    this.subscripcion = this._usuariosServices
      .cambiarPassword(this.form.get('password').value)
      .subscribe(() => {
        this.form.enable();
        this.loading = false;
        this._messageServices.toast('Contraseña actualizada correctamente', 'OK');
      }, err => {
        this.form.enable();
        this.loading = false;
        this._messageServices.error(err);
      });
  }

}

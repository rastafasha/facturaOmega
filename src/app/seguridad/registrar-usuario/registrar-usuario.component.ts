import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Utilerias
import { StandardErrorStateMatcher, passwordIgualValidator } from '../../utils/cchsforms';

// Servicios
import { UsuariosService } from '../../services/usuarios.service';

// Clases
import Usuario from '../../classes/class.usuario';
import { MessagesService } from '../../services/messages.service';

// Configuracion
import * as config from '../../config/config';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styles: [
  ]
})
export class RegistrarUsuarioComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean;
  matcher = new StandardErrorStateMatcher();

  
  registerSuscripcion: Subscription = new Subscription();

  // -------------------------------------------------------------------
  // Constructor de la clase
  // -------------------------------------------------------------------
  constructor(private formBuilder:      FormBuilder,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService) { }

  // -------------------------------------------------------------------
  // Inicialización del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'nombres':   [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      'apellidos': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      'email':     [null, [Validators.required, Validators.email, Validators.maxLength(200)]],
      'password':  [null, [Validators.required, Validators.pattern(new RegExp(config.REG_EXP_PASSWORD))]],
      'confirma':  [null, [Validators.required, Validators.minLength(8), Validators.maxLength(10), passwordIgualValidator('password')]]
    });

    this._messagesService.info(
      `Para facturar tu boleto debes esperar al menos 8 hrs desde el momento en el que éste
      fue generado en la caseta de cobro, ya que por la demanda del servicio ese es el tiempo 
      estimado que tarda en reflejarse 
      en nuestro sistema. Lamentamos el inconveniente que esto pueda generarte y agradecemos
      tu preferencia.`,
      'Atención'
    );
  } // ngOnInit


  // -------------------------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------------------------
  ngOnDestroy(): void {
    this.registerSuscripcion.unsubscribe();
  }

  // -------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------
  submit(): void {
    this.loading = true;
    this.form.disable();

    const usuario: Usuario = new Usuario(
      this.form.get('nombres').value,
      this.form.get('apellidos').value,
      this.form.get('email').value,
      this.form.get('password').value
    );

    this.registerSuscripcion = this._usuariosService
      .registrar(usuario)
      .subscribe(() => {
        // Login del usuario registrado
        this.registerSuscripcion = this._usuariosService
          .login(usuario.email, usuario.password)
          .subscribe(() => {
          }, err => this.terminarSolicitud(err));        
      }, err => this.terminarSolicitud(err));
  } // submit

  // -------------------------------------------------------------------
  // Manegador de los estados de carga
  // -------------------------------------------------------------------
  private terminarSolicitud(err?: any) {
    if (err) {
      this._messagesService.error(err);
    }
    this.loading = false;
    this.form.enable();
  } // terminarSolicitud

}

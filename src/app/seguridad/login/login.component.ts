import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';

// Utilerias
import {StandardErrorStateMatcher} from '../../utils/cchsforms';

// Servicios
import {UsuariosService} from '../../services/usuarios.service';
import {MessagesService} from '../../services/messages.service';

// Clases
import ISesion from '../../classes/interface.sesion';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  hidePassword = true;
  form: FormGroup;
  loading: boolean;
  message: string;
  matcher = new StandardErrorStateMatcher();

  loginSubscripcion: Subscription = new Subscription();


  // -------------------------------------------------------------------
  // Constructor de la clase
  // -------------------------------------------------------------------
  constructor(private formBuilder: FormBuilder,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService) {
    // @ts-ignore
    this.message = window.message;
  }

  // -------------------------------------------------------------------
  // Inicialización del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    const sesion: ISesion = this._usuariosService.obtenerSesion();

    if (sesion) {
      this._usuariosService.redireccionar();
    }

    this.form = this.formBuilder.group({
      'email': null/* 'h.sotomiguel@gmail.com' */,
      'password': null/* 'HugoSo10' */
    });
  } // ngOnInit


  // -------------------------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------------------------
  ngOnDestroy(): void {
    this.loginSubscripcion.unsubscribe();
  } // ngOnDestroy


  // -------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------
  submit(): void {
    const email: string = this.form.get('email').value;
    const password: string = this.form.get('password').value;

    this.loading = true;
    this.form.disable();

    this.loginSubscripcion = this._usuariosService.login(email, password)
      .subscribe(() => {
      }, err => {
        if (err.status == 404) {
          this._messagesService.error('Credenciales incorrectas', 'Credenciales incorrectas');
        } else {
          this._messagesService.error(err);
        }
        this.loading = false;
        this.form.enable();
      });
  } // submit

}

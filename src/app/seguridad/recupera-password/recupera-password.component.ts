import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Servicios
import { MessagesService } from '../../services/messages.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-recupera-password',
  templateUrl: './recupera-password.component.html',
  styles: [
  ]
})
export class RecuperaPasswordComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean;

  subscripcion: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      'email': [null, [Validators.required, Validators.email]]
    });
  }


  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }


  recuperar(): void {
    this.loading = true;  
    this.subscripcion = this._usuariosService
      .recuperarPassword(this.form.get('email').value)
      .subscribe(() => {
        this.loading = false;
        this._messagesService.info('Tu contraseña temporal ha sido enviada a tu correo');
      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  }
}

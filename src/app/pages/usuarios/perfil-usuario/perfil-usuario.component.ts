import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Utilerias
import { StandardErrorStateMatcher, passwordIgualValidator } from '../../../utils/cchsforms';

// Servicios
import { UsuariosService } from '../../../services/usuarios.service';
import { MessagesService } from '../../../services/messages.service';

// Clases
import Usuario from '../../../classes/class.usuario';
import ISesion from '../../../classes/interface.sesion';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styles: [
  ]
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean;
  matcher = new StandardErrorStateMatcher();

  usuario: Usuario;

  usuariosServiceSubscripcion: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService) {
    this.usuario = new Usuario('', '', '', '');
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    this.usuario = sesion.usuario;
  } // constructor

  // -------------------------------------------------------------------
  // Inicialización del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'nombres':   [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      'apellidos': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      'email':     [null, [Validators.required, Validators.email, Validators.maxLength(200)]],
      'telefono':  [null, [Validators.maxLength(10)]],      
    });

    this.loading = true;
    this.form.disable();  
    
    this.usuariosServiceSubscripcion = this._usuariosService.cargar(this.usuario.id)
      .subscribe((usuario: any) => {
        this.loading = false;
        this.form.enable();
        this.usuario.fromJson(usuario);

        this.form.get('nombres').setValue(this.usuario.nombres);
        this.form.get('apellidos').setValue(this.usuario.apellidos);
        this.form.get('email').setValue(this.usuario.email);
        this.form.get('telefono').setValue(this.usuario.telefono);
        
      }, err => {
        this.loading = false;
        this.form.enable();
        this._messagesService.error(err);      
      });
  } // ngOnInit


  // -------------------------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------------------------
  ngOnDestroy(): void {
    this.usuariosServiceSubscripcion.unsubscribe();
  }


  // -------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------
  submit(): void {
    this.loading = true;
    this.form.disable();   

    this.usuario.nombres = this.form.get('nombres').value;
    this.usuario.apellidos = this.form.get('apellidos').value;
    this.usuario.email = this.form.get('email').value;
    this.usuario.telefono = this.form.get('telefono').value;

    this.usuariosServiceSubscripcion = this._usuariosService.actualizar(this.usuario)
      .subscribe(() => {
        this.loading = false;      
        this.form.enable();
        this._messagesService.toast('Cambios realizados satisfactoriamente', 'OK');
        
      }, err => {        
        this.loading = false;      
        this.form.enable();
        this._messagesService.error(err);
      })
  } // submit

}

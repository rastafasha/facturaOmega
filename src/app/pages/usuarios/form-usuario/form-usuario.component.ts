import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

// Utilerias
import { StandardErrorStateMatcher } from '../../../utils/cchsforms';

// Servicios
import { UsuariosService } from '../../../services/usuarios.service';
import { MessagesService } from '../../../services/messages.service';

// Clases
import Usuario from '../../../classes/class.usuario';
import ISesion from '../../../classes/interface.sesion';

// Configuracion
import * as config from '../../../config/config';


@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: []
})
export class FormUsuarioComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading: boolean;
  matcher = new StandardErrorStateMatcher();

  usuario: Usuario;

  usuariosServiceSubscripcion: Subscription = new Subscription();

  sesion: ISesion;

  ADMINISTRADOR: number = Usuario.ADMINISTRADOR;
  CLIENTE: number = Usuario.CLIENTE;
  CAPTURISTA: number = Usuario.CAPTURISTA;

  constructor(private formBuilder: FormBuilder,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.usuario = new Usuario('', '', '', '');
    this.usuario.id = this.activatedRoute.snapshot.params['id'];    
    this.sesion = this._usuariosService.obtenerSesion();
  } // constructor

  // -------------------------------------------------------------------
  // Inicialización del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'nombres'  : [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      'apellidos': [null, [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      'email'    : [null, [Validators.required, Validators.email, Validators.maxLength(200)]],
      'telefono' : [null, [Validators.maxLength(10)]],   
      'perfiles'   : [null, Validators.required]
    });

    if (this.usuario.id) {
      this.loading = true;
      
      this.usuariosServiceSubscripcion = this._usuariosService
        .cargar(this.usuario.id)
        .subscribe((usuario: Usuario) => {
          this.loading = false;               
          this.usuario = usuario;
  
          this.form.get('nombres').setValue(this.usuario.nombres);
          this.form.get('apellidos').setValue(this.usuario.apellidos);
          this.form.get('email').setValue(this.usuario.email);
          this.form.get('telefono').setValue(this.usuario.telefono);
          this.form.get('perfiles').setValue(this.usuario.perfiles);
          
        }, err => {
          this.loading = false;
          this._messagesService.error(err);      
        });
    }

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
    this.usuario.password = config.PASSWORD_DEFAULT;
    this.usuario.telefono = this.form.get('telefono').value;
    this.usuario.perfiles = this.form.get('perfiles').value;    
    
    let accion: Observable<Usuario>;

    if (this.usuario.id) {
      accion = this._usuariosService.actualizar(this.usuario);
    } else {
      accion = this._usuariosService.nuevo(this.usuario);
    }

    this.usuariosServiceSubscripcion = accion.subscribe((usuario: Usuario) => {        
        this._messagesService.toast(`Datos de ${usuario.nombreCompleto} actualizados`, 'OK');
        if (!this.usuario.id) {
          this._messagesService.info(`La contraseña temporal para ${usuario.nombreCompleto} es "${config.PASSWORD_DEFAULT}"`);
        }
        this.router.navigate([`/${this.sesion.path}/usuarios`]);
      }, err => {        
        this.loading = false;      
        this.form.enable();
        this._messagesService.error(err);
      })
  } // submit

}

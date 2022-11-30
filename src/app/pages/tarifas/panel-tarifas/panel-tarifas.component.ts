/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @description Panel de operaciones con tarifas
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

// Clases
import { Tarifa } from '../../../classes/tarifa';
import ISesion from '../../../classes/interface.sesion';

// Servicios
import { TarifasService } from '../../../services/tarifas.service';
import { MessagesService } from '../../../services/messages.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-panel-tarifas',
  templateUrl: './panel-tarifas.component.html',
  styles: [
  ]
})
export class PanelTarifasComponent implements OnInit {

  /**
   * @property
   * @type {Subscription}
   * @description Suscripcion a observables
   */
  subscription: Subscription = new Subscription();

  /**
   * @property
   * @type {boolean}
   * @description Bandera de carga para operaciones asincronas
   */
  loading: boolean;

  /**
   * @property
   * @type {ISesion}
   * @description Sesion de usuario
   */
  sesion: ISesion;

  /**
   * @property
   * @type {Tarifa[]}
   * @description Listado de tarifas
   */
  tarifas: Tarifa[] = [];


  /**
   * @constructor
   */
  constructor(private _tarifasService: TarifasService,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService,
              private router: Router) {
    this.sesion = this._usuariosService.obtenerSesion();
  }

    
  /**
   * @method ngOnInit
   * @description Inicializacion del componente
   */
  ngOnInit(): void {
    this.buscar();
  }


  /**
   * @method buscar
   * @description Realiza peticion al backend para cargar las tarifas
   */
  buscar(): void { 
    this.loading = true;
    
    this.subscription = this._tarifasService.cargarTodos()
      .subscribe(res => {
        this.tarifas = res.tarifas;
        this.loading = false;
      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  } // buscar


  /**
   * @method handleCreate
   * @description LLama al formulario de tarifa para creacion
   */
  handleCreate(): void {
    this.router.navigate([`${this.sesion.path}/tarifa`]);    
  }


  /**
  * @method handleUpdate
  * @description LLama al formulario de tarifa para edicion
  * @param {Tarifa} tarifa Tarifa a editar
  */
  handleUpdate(tarifa: Tarifa): void {
    this.router.navigate([`${this.sesion.path}/tarifa/${tarifa.id}`]);    
  }

  /**
  * @method handleDelete
  * @description Solicita eliminacion de la tarifa
  * @param {Tarifa} tarifa Tarifa a eliminar
  */
  handleDelete(tarifa: Tarifa): void {
    this._messagesService.confirm(`Eliminar ${tarifa.id}`, () => {
      this.loading = true;
      this.subscription = this._tarifasService.eliminar(tarifa)
        .subscribe(tarifa => {
          this._messagesService.toast(`${tarifa.id} eliminada`);
          this.buscar();      
        }, err => {
          this.loading = false;
          this._messagesService.error(err);
        });
    });   
  }

}
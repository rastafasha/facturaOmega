/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @description Formulario de edicion y creacion de tarifas
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

// Servicios
import { TarifasService } from '../../../services/tarifas.service';
import { MessagesService } from '../../../services/messages.service';
import { UsuariosService } from '../../../services/usuarios.service';

// Clases
import { Tarifa } from '../../../classes/tarifa';
import ISesion from '../../../classes/interface.sesion';

@Component({
  selector: 'app-formulario-tarifa',
  templateUrl: './formulario-tarifa.component.html',
  styles: [
  ]
})
export class FormularioTarifaComponent implements OnDestroy, OnInit {

  /**
   * @property
   * @type {Tarifa}
   * @description Tarifa que encapsula la informacion
   */
  tarifa: Tarifa; 

  /**
   * @property
   * @type {boolean}
   * @description Bandera de carga para operaciones asincronas
   */
  loading: boolean;

  sesion: ISesion;

  subscription: Subscription = new Subscription();

  /**
   * @constructor
   */
  constructor(private _tarifasService: TarifasService,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.tarifa = new Tarifa();
    this.sesion = this._usuariosService.obtenerSesion();
  }

  /**
   * @method
   * @description Inicializacion del componente y carga de la tarifa en modo update
   */
  ngOnInit(): void {
    const id: string = this.activatedRoute.snapshot.params['id'];
    if (!id) {
      return;
    }

    this.loading = true;
    this.subscription = this._tarifasService.cargar(id)
      .subscribe(tarifa => {
        this.loading = false;
        this.tarifa = tarifa;
        
      }, err => {
        this.loading = false;
        this._messagesService.error(err);
        this.router.navigate([`${this.sesion.path}/tarifas`]);
      });
  }

  /**
   * @method ngOnDestroy
   * @description Libera memoria
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  /**
   * @method handleSubmit
   * @description Aplica cambios en la base de datos
   * @param tarifa Tarifa a guardar/actualizar
   */
  handleSubmit(tarifa: Tarifa): void {
    const id: string = this.activatedRoute.snapshot.params['id'];
    let observable: Observable<Tarifa>;
    this.loading = true;

    if (id) {
      observable = this._tarifasService.actualizar(tarifa);
    } else {
      observable = this._tarifasService.guardar(tarifa);
    }

    this.subscription = observable.subscribe(nuevaTarifa => {        
        this._messagesService.toast(`Tarifa ${nuevaTarifa.id} guardada satisfactoriamente`);
        this.router.navigate([`${this.sesion.path}/tarifas`]);

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });    
  }

  /**
   * @method handleCancel
   * @description Abortar cambios en la base de datos
   */
  handleCancel(): void {
    this.router.navigate([`${this.sesion.path}/tarifas`]);
  }

}

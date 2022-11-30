import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSidenav} from '@angular/material/sidenav';
import {Subscription} from 'rxjs';

// Servicios
import {UsuariosService} from '../services/usuarios.service';
import {RfcsService} from '../services/rfcs.service';
import {MessagesService} from '../services/messages.service';
import {PagesService} from '../services/pages.service';

// Clases
import Usuario from '../classes/class.usuario';
import RFC from '../classes/class.rfc';

// Routes
import {routesAdministrador, routesCliente, routesCapturista} from '../routes/routes';

// Componentes
import {SeleccionRfcComponent} from './usuarios/seleccion-rfc/seleccion-rfc.component';
import {FormRfcComponent} from './usuarios/form-rfc/form-rfc.component';
import ISesion from '../classes/interface.sesion';

// Configuracion
import * as config from '../config/config';
import {Address} from '../classes/class.address';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit, OnDestroy, AfterViewInit {

  sesion: ISesion;
  menuPrincipal = [];
  rfcs: RFC[] = [];
  loading: boolean;
  camposFiltro: any[] = [];
  @ViewChild('filtro') filtro: MatSidenav;
  @ViewChild('menu') menu: MatSidenav;

  changeRFCsSubscripcion: Subscription = new Subscription();
  modalRFCSubscripcion: Subscription = new Subscription();
  rfcServiceSubscripcion: Subscription = new Subscription();
  filtroSubscripcion: Subscription = new Subscription();
  sessionUpdatedSubscription: Subscription = new Subscription();

  CLIENTE: number = Usuario.CLIENTE;

  // -------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------
  constructor(private _usuariosService: UsuariosService,
              private _rfcsService: RfcsService,
              private _messagesService: MessagesService,
              private _pagesService: PagesService,
              private router: Router,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
    // Cargamos la sesion
    this.sesion = this._usuariosService.obtenerSesion();
    // Ejecutamos seleccionar perfil para poder cargar el menu
    this.seleccionarPerfil(this.sesion.perfil);
  } // constructor


  // -------------------------------------------------------------------
  // Inicializacion del componente
  // -------------------------------------------------------------------
  ngOnInit(): void {
    // Escuchamos cambios en el sitio
    this.changeRFCsSubscripcion = this._pagesService.changeRFCs
      .subscribe((rfcs: RFC[]) => {
        if (this.sesion.perfil == Usuario.CLIENTE) {
          this.rfcs = rfcs
          this.seleccionarRFC();
        }
      });

    if (this.sesion.perfil == Usuario.CLIENTE) {
      this.cargarRFCs().then(() => this.seleccionarRFC());
    }
  } // ngOnInit


  // --------------------------------------------
  // Inicializacion del paginador
  // --------------------------------------------
  ngAfterViewInit(): void {
    this.isMovile();

    this.sessionUpdatedSubscription = this._usuariosService.sessionUpdated
      .subscribe((session: any) => {
        this.sesion = session;
      });

    this.filtroSubscripcion = this._pagesService.openedFiltro
      .subscribe((campos: any[]) => {
        this.camposFiltro = campos;

        if (this.isMovile()) {
          return;
        }

        this.cdr.detectChanges();

        if (campos && campos.length > 0) {
          // Si se abre el panel
          if (!this.filtro.opened) {
            // Si no está abierto lo abrimos
            this.filtro.open();
          }
        } else {
          // Si se desea cerrar el panel
          if (this.filtro.opened) {
            // Si esta abierto lo cerramos
            this.filtro.close();
          }
        }
      });
  } // ngAfterViewInit


  // --------------------------------------------
  // Limpieza al destruir el componente
  // --------------------------------------------
  ngOnDestroy(): void {
    this.changeRFCsSubscripcion.unsubscribe();
    this.rfcServiceSubscripcion.unsubscribe();
    this.modalRFCSubscripcion.unsubscribe();
    this.filtroSubscripcion.unsubscribe();
    this.sessionUpdatedSubscription.unsubscribe();
  } // ngOnDestroy


  // -------------------------------------------------------------------
  // Carga los RFCs
  // -------------------------------------------------------------------
  cargarRFCs(): Promise<RFC[]> {
    this.loading = true
    return new Promise((resolve, reject) => {
      this.rfcServiceSubscripcion = this._rfcsService.cargarTodos()
        .subscribe(res => {
          this.loading = false;
          this.rfcs = res.rfcs;
          resolve(this.rfcs);

        }, err => {
          this.loading = false;
          this._messagesService.error(err);
          reject(err);
        });
    });
  } // cargarRFCs


  // -------------------------------------------------------------------
  // Establece los mecanismos para seleccionar un RFC
  // -------------------------------------------------------------------
  seleccionarRFC(): void {
    if (this.rfcs.length === 0) {
      // Si no hay RFCs agregamos uno
      this.asignarRFC(null);
      this.agregarRFC();
    } else if (this.rfcs.length === 1) {
      this.asignarRFC(this.rfcs[0]);
    } else {
      this.abrirMenuRFC();
    }
  } // seleccionarRFC


  // -------------------------------------------------------------------
  // Abre el listado de RFCs para su seleccion
  // -------------------------------------------------------------------
  abrirMenuRFC(): void {
    this.cargarRFCs().then(() => {
      const ref = this.bottomSheet.open(SeleccionRfcComponent, {
        data: this.rfcs,
        disableClose: this.sesion.rfc ? false : true
      });

      this.modalRFCSubscripcion = ref.afterDismissed()
        .subscribe(rfc => {
          if (rfc) {
            this.asignarRFC(rfc);
          }
        });
    });
  } // abrirMenuRFC


  // -------------------------------------------------------------------
  // Asiga un RFC a la sesion
  // -------------------------------------------------------------------
  asignarRFC(rfc: RFC): void {
    // Guardamos el RFC en sesion
    this.sesion.rfc = rfc;
    this._usuariosService.guardarSesion(this.sesion);

    // Asignamos el RFC de trabajo
    this.sesion.rfc = rfc || this.sesion.rfc || new RFC('', '', '', new Address());
    // Informamos que el RFC ha sido cambiado
    this._pagesService.selectRFC(this.sesion.rfc);

    if (rfc) {
      this._messagesService.toast(`${rfc.clave} seleccionado correctamente`);
    }
    // Recargamos menu de RFCs
    this.rfcs = [...this.rfcs];
  } // asignarRFC


  // --------------------------------------------
  // Abre el dialogo para agregar o editar un RFC
  // --------------------------------------------
  agregarRFC(): void {
    const dialogRef = this.dialog.open(FormRfcComponent, {
      data: {rfc: null},
      hasBackdrop: true,
      disableClose: true
    });

    this.modalRFCSubscripcion = dialogRef.afterClosed()
      .subscribe(nuevoRFC => {
        if (nuevoRFC) {
          this._messagesService.toast(`${nuevoRFC.clave} agregado satisfactoriamente`, 'OK');
          this.rfcs.push(nuevoRFC);
          this._pagesService.changeRFCs.emit(this.rfcs);
        }
      });
  } // agregarRFC


  // -------------------------------------------------------------------
  // Seleccionar un perfil
  // -------------------------------------------------------------------
  seleccionarPerfil(perfil: number) {
    this.sesion.perfil = perfil;

    switch (perfil) {
      case Usuario.ADMINISTRADOR:
        this.menuPrincipal = routesAdministrador;
        this.sesion.path = config.RUTA_ADMINISTRADOR;
        break;
      case Usuario.CAPTURISTA:
        this.menuPrincipal = routesCapturista;
        this.sesion.path = config.RUTA_CAPTURISTA;
        break;
      default:
        this.sesion.path = config.RUTA_CLIENTE;
        this.menuPrincipal = routesCliente;
    }

    this._usuariosService.guardarSesion(this.sesion);
    this._usuariosService.redireccionar();
  } // seleccionarPerfil


  // ---------------------------------------------------
  // Oculta barras laterales cuando es un teléfono movil
  // ---------------------------------------------------
  isMovile() {
    if (window.screen.width < 575.98) {
      this.filtro.close();
      this.menu.close();
      return true;
    } else {
      return false;
    }
  } // isMovile


  ir(ruta: string): void {
    this.router.navigate([`/${this.sesion.path}/${ruta}`]);
    this.isMovile();
  }


  // -------------------------------------------------------------------
  // Salir de la aplicacion
  // -------------------------------------------------------------------
  salir(): void {
    this._usuariosService.limpiarSesion();
    this.router.navigate(['/login']);
  } // salir


  // -------------------------------------------------------------------
  // Envia al componente hijo los valores de los filtros solicitados
  // -------------------------------------------------------------------
  onFiltered(filtros: any) {
    this._pagesService.onFilter(filtros);
    this.isMovile();
  }

}

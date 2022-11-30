import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

// Servicios
import { MessagesService } from '../../../services/messages.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { PagesService } from '../../../services/pages.service';

// Clases
import Usuario from '../../../classes/class.usuario';
import ISesion from '../../../classes/interface.sesion';

@Component({
  selector: 'app-panel-usuario',
  templateUrl: './panel-usuario.component.html',
  styleUrls: []
})
export class PanelUsuarioComponent implements AfterViewInit, OnDestroy {

  columnas: string[] = ['usuario', 'email', 'telefono', 'status', 'tipo', 'acciones'];
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  totalRegistros: number;
  loading: boolean;
  pageSize: number = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  usuariosServiceSuscripcion: Subscription = new Subscription();
  pagesServiceSuscripcion: Subscription = new Subscription();

  ALTA: number = Usuario.ALTA;
  BAJA: number = Usuario.BAJA;

  sesion: ISesion;

  filters: any = [
    {
      name: 'nombres',
      type: 1,
      label: 'Nombres del usuario'
    },
    {
      name: 'apellidos',
      type: 1,
      label: 'Apellidos del usuario'
    },
    {
      name: 'email',
      type: 1,
      label: 'Correo electrónico'
    },
    {
      name: 'telefono',
      type: 1,
      label: 'Teléfono'
    }
  ];

  filtersData: any = {};

  // --------------------------------------------
  // Constructor
  // --------------------------------------------
  constructor(public dialog: MatDialog,
              private _messagesService: MessagesService,
              public _usuariosService: UsuariosService,
              private _pagesService: PagesService) {
    this.sesion = this._usuariosService.obtenerSesion();
  }


  // --------------------------------------------
  // Inicializacion del paginador
  // --------------------------------------------
  ngAfterViewInit(): void {
    this.cargarUsuarios();
    this._pagesService.openedFiltro.emit(this.filters);

    this.pagesServiceSuscripcion = this._pagesService.filtered
      .subscribe((filtros: any) => {
        this.filtersData = filtros;
        this.cargarUsuarios();
      });
  } // ngAfterViewInit


  // --------------------------------------------
  // Limpieza de memoria
  // --------------------------------------------
  ngOnDestroy(): void {
    this._pagesService.openedFiltro.emit([]);
    this.usuariosServiceSuscripcion.unsubscribe();
    this.pagesServiceSuscripcion.unsubscribe();
  } // ngOnDestroy


  // --------------------------------------------
  // Solicita al backend el listado de usuarios
  // --------------------------------------------
  cargarUsuarios() {
    this.usuariosServiceSuscripcion = merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this._usuariosService.cargarTodos(this.filtersData, this.paginator.pageIndex + 1, this.pageSize);
        }),
        map(res => {
          this.loading = false;
          this.totalRegistros = res.total_registros;  
          return res.usuarios;
        }),
        catchError((err) => {
          this.loading = false;
          this._messagesService.error(err);
          return observableOf([]);
        })
      ).subscribe((usuarios: Usuario[]) => this.dataSource.data = usuarios);
  } // cargarUsuarios


  // --------------------------------------------
  // Cambiar status del usuario
  // --------------------------------------------
  cambiarStatus(usuario: any, index: number): void {
    const user: Usuario = new Usuario('', '', '', '');
    user.fromJson(usuario);

    this.loading = true;

    this.usuariosServiceSuscripcion = this._usuariosService
      .cambiarStatus(user)
      .subscribe((usuario: Usuario) => {
        this.loading = false;
        this.dataSource.data[index].alta = this.dataSource.data[index].alta == 1 ? 0 : 1;
        this.dataSource.data = [...this.dataSource.data];
        this._messagesService.toast(`Status de ${usuario.nombreCompleto} cambiado satisfactoriamente`, 'OK');

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  } // cambiarStatus


  // --------------------------------------------
  // Reinicia la contraseña del usuario
  // --------------------------------------------
  reiniciarPassword(usuario: any): void {
    const user: Usuario = new Usuario('', '', '', '');
    user.fromJson(usuario);

    this.loading = true;

    this.usuariosServiceSuscripcion = this._usuariosService
      .reiniciarPassword(user)
      .subscribe(usuario => {
        this.loading = false;
        this._messagesService.info(usuario.password, 'Nueva contraseña de ' + usuario.nombres);

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  } // cambiarStatus


  // -------------------------------------------
  // Evento para paginacio movil
  // -------------------------------------------
  cambiarPaginaMovil(pagina: number): void {
    this.dataSource.data = [];
    this.paginator.pageIndex = pagina;
    this.cargarUsuarios();
  } // cambiarPaginaMovil

}

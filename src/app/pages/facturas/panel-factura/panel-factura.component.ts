import {Component, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {merge, of as observableOf, Subscription} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

// Servicios
import {MessagesService} from '../../../services/messages.service';
import {FacturasService} from '../../../services/facturas.service';
import {UsuariosService} from '../../../services/usuarios.service';
import {PagesService} from '../../../services/pages.service';

// Models
import ISesion from '../../../classes/interface.sesion';
import RFC from '../../../classes/class.rfc';

@Component({
  selector: 'app-panel-factura',
  templateUrl: './panel-factura.component.html',
  styles: []
})
export class PanelFacturaComponent implements AfterViewInit, OnDestroy {

  columnas: string[] = ['rfc', 'fecha_creacion', 'folio', 'monto', 'status', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalRegistros: number = 0;
  totalPagina: number = 10;
  loading: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  facturasServiceSuscripcion: Subscription = new Subscription();
  pagesServiceSuscripcion: Subscription = new Subscription();
  sessionUpdatedSubscription: Subscription = new Subscription();

  sesion: ISesion;

  // --------------------------------------------
  // Constructor
  // --------------------------------------------
  constructor(public dialog: MatDialog,
              private cdf: ChangeDetectorRef,
              private _messagesService: MessagesService,
              private _pagesService: PagesService,
              private _facturasService: FacturasService,
              private _usuariosService: UsuariosService) {
    this.sesion = this._usuariosService.obtenerSesion();
  }


  // --------------------------------------------
  // Inicializacion del paginador
  // --------------------------------------------
  ngAfterViewInit(): void {
    this.pagesServiceSuscripcion = this._pagesService.selectedRFC
      .subscribe((rfc: RFC) => {
        this.sesion.rfc = rfc;
        this.cargarFacturas()
      });

    this.sessionUpdatedSubscription = this._usuariosService.sessionUpdated
      .subscribe((session: any) => {
        this.sesion = session;
      });

    this.cargarFacturas();
  } // ngAfterViewInit


  // --------------------------------------------
  // Limpieza de memoria
  // --------------------------------------------
  ngOnDestroy(): void {
    this._pagesService.openedFiltro.emit([]);
    this.facturasServiceSuscripcion.unsubscribe();
    this.pagesServiceSuscripcion.unsubscribe();
    this.sessionUpdatedSubscription.unsubscribe();
  } // ngOnDestroy


  // --------------------------------------------
  // Solicita al backend el listado de facturas
  // --------------------------------------------
  cargarFacturas() {
    if (!this.sesion.rfc) {
      this._messagesService.info('Para mostrar las facturas debe seleccionar un RFC en el menú');
      return;
    }

    this.facturasServiceSuscripcion = merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;

          return this._facturasService
            .cargarTodas({rfcs_id: this.sesion.rfc.id}, this.paginator.pageIndex + 1, this.totalPagina);
        }),
        map(data => {
          this.loading = false;
          this.totalRegistros = data.total_registros;
          return data.facturas;
        }),
        catchError((err) => {
          this.loading = false;
          this._messagesService.error(err);
          return observableOf([]);
        })
      ).subscribe(facturas => this.dataSource.data = facturas);

    this.cdf.detectChanges();
  } // cargarFacturas


  // -------------------------------------------------------------------
  // Verificar
  // -------------------------------------------------------------------
  verificar(factura: any) {
    window.open(factura.verification_url, '_blank');
  } // verificar


  // --------------------------------------------
  // Descarga una factura en PDF, XML o ZIP
  // --------------------------------------------
  descargar(factura: any, formato: string): void {
    this.loading = true;
    this.facturasServiceSuscripcion = this._facturasService
      .descargar(factura.id, formato)
      .subscribe(() => this.loading = false, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  }


  // --------------------------------------------
  // Envia una factura al email
  // --------------------------------------------
  enviarEmail(factura: any): void {
    this.loading = true;
    this.facturasServiceSuscripcion = this._facturasService
      .enviarEmail(factura)
      .subscribe(() => {
        this.loading = false;
        this._messagesService.toast('La factura ha sido enviada a tu correo electrónico');

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  }


  // ---------------------------------------------------
  // Obtiene una clase a partir del status de la factura
  // ---------------------------------------------------
  getStatusColor(factura: any): string {
    if (factura.status === 'canceled') {
      return 'warn';
    } else if (factura.status === 'valid') {
      if (factura.cancellation_status === 'pending') {
        return 'accent';
      } else {
        return 'primary';
      }
    }
  } // getStatus color


  // -------------------------------------------
  // Evento para paginacio movil
  // -------------------------------------------
  cambiarPaginaMovil(pagina: number): void {
    this.dataSource.data = [];
    this.paginator.pageIndex = pagina;
    this.cargarFacturas();
  } // cambiarPaginaMovil

}

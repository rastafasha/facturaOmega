import {Component, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {merge, of as observableOf, Subscription} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

// Servicios
import {MessagesService} from '../../../services/messages.service';
import {PagesService} from '../../../services/pages.service';
import {FacturasService} from '../../../services/facturas.service';

// Models
import ISesion from 'src/app/classes/interface.sesion';
import {UsuariosService} from 'src/app/services/usuarios.service';
import {MatDialog} from '@angular/material/dialog';
import {FormCancelarFacturaComponent} from '../form-cancelar-factura/form-cancelar-factura.component';
import { Factura } from 'src/app/classes/interface.factura';

@Component({
  selector: 'app-facturas-general',
  templateUrl: './facturas-general.component.html',
  styles: []
})
export class FacturasGeneralComponent implements OnDestroy, AfterViewInit {

  columnas: string[] = ['clave', 'fecha_creacion', 'folio', 'monto', 'status', 'acciones'];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalRegistros = 0;
  totalPagina = 10;
  loading: boolean;
  sesion: ISesion;
  cancelData:any;

  factura: Factura;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  facturasServiceSubscripcion: Subscription = new Subscription();
  pagesServiceSuscripcion: Subscription = new Subscription();

  filters: any = [
    {
      name: 'fecha_inicial',
      type: 3,
      label: 'Fecha inicial'
    },
    {
      name: 'fecha_final',
      type: 3,
      label: 'Fecha final'
    },
    {
      name: 'status',
      type: 5,
      label: 'Estatus de factura',
      data: [
        {id: null, value: '[Todos]'},
        {id: 'valid', value: 'Aprobada'},
        {id: 'pending', value: 'En espera'},
        {id: 'canceled', value: 'Cancelada'},
      ]
    },
    {
      name: 'series',
      type: 5,
      label: 'Tipo de factura',
      data: [
        {id: null, value: '[Todos]'},
        {id: 'CAS-', value: 'Ingreso'},
        {id: 'CAP-', value: 'Pago'},
      ]
    },
    {
      name: 'uuid',
      type: 1,
      label: 'Folio fiscal (UUID)'
    },
  ];

  filtersData: any = {};
  segundosEspera: number;

  // -------------------------------------------------
  // Constructor de la clase
  // -------------------------------------------------
  constructor(private _messagesService: MessagesService,
              private _facturasService: FacturasService,
              private _pagesService: PagesService,
              private dialog: MatDialog,
              private _usuariosService: UsuariosService) {
    this.sesion = this._usuariosService.obtenerSesion();
  } // constructor


  // -------------------------------------------------
  // Inicializacion del componente
  // -------------------------------------------------
  ngAfterViewInit(): void {
    this._pagesService.openedFiltro.emit(this.filters);

    this.pagesServiceSuscripcion = this._pagesService.filtered
      .subscribe((filtros: any) => {
        this.filtersData = filtros;
        this.buscar();
      });

    this.buscar();
  } // ngOnInit


  // -------------------------------------------------
  // Destruccion del componetne
  // -------------------------------------------------
  ngOnDestroy(): void {
    this._pagesService.openedFiltro.emit([]);
    this.facturasServiceSubscripcion.unsubscribe();
    this.pagesServiceSuscripcion.unsubscribe();
  } // ngOnInit


  // --------------------------------------------
  // Solicita los boletos al backend
  // --------------------------------------------
  buscar() {
    this.facturasServiceSubscripcion = merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this._facturasService
            .cargarTodas(this.filtersData, this.paginator.pageIndex + 1, this.totalPagina);
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
  } // buscar


  // --------------------------------------------
  // Descarga una factura en PDF, XML o ZIP
  // --------------------------------------------
  descargar(factura: any, formato: string): void {
    this.loading = true;
    this.facturasServiceSubscripcion = this._facturasService
      .descargar(factura.id, formato)
      .subscribe(() => this.loading = false, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  }


  /**
   * @method descargarTodas Descarga un grupo de facturas de la página actual
   */
  descargarTodas() {
    if (!this.filtersData.fecha_inicial || !this.filtersData.fecha_final) {
      this._messagesService.error('Debe filtrar primero el periodo de las facturas a descargar.', 'Seleccionar periodo');
      return;
    }

    this._messagesService.confirm(`Este proceso puede tardar varios minutos, ¿Desea continuar?.`, () => {

      const intervalo = setInterval(() => this.segundosEspera = this.segundosEspera >= 1 ? this.segundosEspera + 1 : 1, 1000);

      this.loading = true;
      this.facturasServiceSubscripcion = this._facturasService
        .descargarFacturas(this.filtersData, 0, 0)
        .subscribe(() => {
          clearInterval(intervalo);
          this.segundosEspera = null;
          this.loading = false;
          this._messagesService.info('Las facturas se descargaron satisfactoriamente');

        }, err => {
          clearInterval(intervalo);
          this.segundosEspera = null;
          this.loading = false;
          this._messagesService.error(
            'Intente descargar las facturas por semana o por quincena',
            'Se superó el tiempo límite de descarga'
          );
        });
    }); // callback
  }


  // --------------------------------------------
  // Cancela una factura
  // --------------------------------------------

  cancelar(factura: any): void {
    const dialogCancelar = this.dialog.open(FormCancelarFacturaComponent, {
      height: '300px',
      width: '600px'
    });
    dialogCancelar.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      this.loading = true;
      this.facturasServiceSubscripcion = this._facturasService.cancelar({
        id: factura.id,
        ...result
      })
        .subscribe(() => {
          this.loading = false;
          this._messagesService.toast('Solicitud de cancelación enviada', 'ok');
          this.buscar();
        }, err => {
          this.loading = false;
          this._messagesService.error(err);
        });
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
    this.buscar();
  } // cambiarPaginaMovil


}

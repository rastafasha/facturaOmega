import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

// Servicios
import { MessagesService } from '../../../services/messages.service';
import { BoletosService } from 'src/app/services/boletos.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { PagesService } from '../../../services/pages.service';
import { FacturasService } from '../../../services/facturas.service';

// Clases
import { Boleto } from '../../../classes/class.boleto';
import ISesion from '../../../classes/interface.sesion';
import Usuario from '../../../classes/class.usuario';
import { DataTypePipe } from '../../../pipes/data-type.pipe';

// Componentes
import { FormBoletoComponent } from '../form-boleto/form-boleto.component';

// Configuracion
import * as config from '../../../config/config';


@Component({
  selector: 'app-panel-boleto',
  templateUrl: './panel-boleto.component.html',
  styles: [
  ]
})
export class PanelBoletoComponent implements AfterViewInit, OnDestroy {

  columnas: string[] = ['fecha', 'hora', 'carril', 'senal', 'tarifa', 'pago', 'folio', 'timbrado', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  totalRegistros: number = 0;
  loading: boolean;
  pageSize: number = 10;

  boletosServiceSuscripcion: Subscription = new Subscription();
  pagesServiceSuscripcion: Subscription = new Subscription();
  facturasServiceSuscripcion: Subscription = new Subscription();

  readonly ADMINISTRADOR = Usuario.ADMINISTRADOR;
  readonly CAPTURISTA = Usuario.CAPTURISTA;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  filters: any[] = [
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
      label: 'Status',
      data: [
        { id: null, value: '[Todos]' },
        { id: 1, value: 'Timbrados por clientes' },
        { id: 2, value: 'Timbrados por administradores' },
        { id: 3, value: 'Sin timbrar' },
      ]
    },
    {
      name: 'folio',
      type: 1,
      label: 'Folio'
    },
    {
      name: 'carril',
      type: 2,
      label: 'Carril'
    },
    {
      name: 'senal',
      type: 1,
      label: 'Señal'
    },
    {
      name: 'pago',
      type: 1,
      label: 'Pago'
    }
  ];

  filtersData: any = {};

  sesion: ISesion;

  // --------------------------------------------
  // Constructor
  // --------------------------------------------
  constructor(public dialog: MatDialog,
              private pagesService: PagesService,
              private _messagesService: MessagesService,
              private _boletosService: BoletosService,
              private _usuariosService: UsuariosService,
              private _pagesService: PagesService,
              private _facturasService: FacturasService) {
    this.sesion = this._usuariosService.obtenerSesion();
  }

  // --------------------------------------------
  // Limpieza de memoria
  // --------------------------------------------
  ngOnDestroy(): void {
    this.pagesService.openedFiltro.emit([]); // Cerramos filtro
    this.boletosServiceSuscripcion.unsubscribe();
    this.pagesServiceSuscripcion.unsubscribe();
    this.facturasServiceSuscripcion.unsubscribe();
  } // ngOnDestroy



  // --------------------------------------------
  // Inicializacion del paginador
  // --------------------------------------------
  ngAfterViewInit() {
    this.buscar();

    this.pagesService.openedFiltro.emit(this.filters);

    this.pagesServiceSuscripcion = this._pagesService.filtered
      .subscribe((filtros: any) => {
        this.filtersData = filtros;
        this.buscar();
      });
  } // ngAfterViewInit


  // --------------------------------------------
  // Solicita los boletos al backend
  // --------------------------------------------
  buscar() {
    this.boletosServiceSuscripcion = merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this._boletosService
            .cargarTodos(this.filtersData, this.paginator.pageIndex + 1, this.paginator.pageSize);
        }),
        map(data => {
          this.loading = false;
          this.totalRegistros = data.total_registros;
          return data.boletos;
        }),
        catchError((err) => {
          console.log(err);

          this.loading = false;
          this._messagesService.error(err);
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  } // buscar


  // --------------------------------------------
  // Abre el dialogo para agregar o editar un RFC
  // --------------------------------------------
  agregarBoleto(boleto?: Boleto): void {
    this.dialog.open(FormBoletoComponent, {
      data: { boleto: boleto },
      hasBackdrop: true,
      disableClose: true
    })
    .afterClosed()
    .subscribe(nuevoBoleto => {
      if (nuevoBoleto) {
        this._messagesService.toast(`Cambios aplicados correctamente`, 'OK');
        this.buscar();
      }
    });
  } // agregarBoleto


  // --------------------------------------------
  // Elimina un RFC
  // --------------------------------------------
  eliminarBoleto(boleto: Boleto): void {
    this._messagesService.confirm(`¿Desea eliminar este boleto?`, () => {
      this.loading = true;
      this._boletosService.eliminar(boleto)
        .subscribe(() => {
          this._messagesService.toast(`Boleto eliminado correctamente`, 'OK');
          this.buscar();
        }, err => {
          this.loading = false;
          this._messagesService.error(err);
        });
    });
  } // eliminarBoleto


  // --------------------------------------------
  // Descarga una factura en PDF,
  // --------------------------------------------
  descargar(boleto: Boleto): void {
    this.loading = true;
    this.facturasServiceSuscripcion = this._facturasService
      .descargar(boleto.id_facturapi)
      .subscribe(() => this.loading = false, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  }


  // --------------------------------------------
  // Solicita los boletos al backend y genera
  // el archivo xls
  // --------------------------------------------
  generarReporte() {
    this.loading = true;

    this.boletosServiceSuscripcion = this._boletosService
      .reporte(this.filtersData)
      .subscribe(async res => {
        // Generamos el reporte
        const json: any[] = [];
        for (let i in res.boletos) {
          const boleto = res.boletos[i];

          const tarifa: number = Number(boleto.tarifa);

          let row: any = {
            'CARRIL'                 : boleto.carril,
            'FECHA EMISION'          : boleto.fecha,
            'CLASE'                  : boleto.senal,
            'IMPORTE SIN IMPUESTOS'  : tarifa - (tarifa * config.IVA),
            'IMPUESTOS'              : config.IVA * tarifa,
            'IMPORTE CON IMPUESTOS'  : tarifa,
            // 'RFC EMISOR'             : factura.uuid,
            'RFC RECEPTOR'           : boleto.clave,
            'RAZON SOCIAL RECEPTOR'  : boleto.razon_social ? boleto.razon_social : !boleto.nombres ? '' : `${boleto.nombres} ${boleto.apellidos}`,
            'ESTATUS'                : boleto.status,
            'MENSAJE ERROR TIMBRADO' : boleto.cancellation_status,
            'UUID'                   : boleto.uuid,
            'SERIE DE FACTURACION'   : boleto.series,
            'FOLIO DE FACTURACION'   : boleto.folio_number,
            'FECHA DE TIMBRADO'      : boleto.created_at
          };

          json.push(row);
        }

        this._boletosService.toXLS(json, 'Reporte.xlsx');
        this._messagesService.toast('El reporte ha sido generado', 'OK');
        this.loading = false;

      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  } // buscar


  // -------------------------------------------
  // Evento para paginacio movil
  // -------------------------------------------
  cambiarPaginaMovil(pagina: number): void {
    this.dataSource.data = [];
    this.paginator.pageIndex = pagina;
    this.buscar();
  } // cambiarPaginaMovil



  /**
   * @method eliminarBoletos
   * @description Elimina los boletos que cumplen con las condiciones de filterData
   */
  eliminarBoletos(): void {
    if (this.filtersData.status !== 3) {
      this._messagesService.error('Solo se pueden borrar boletos sin timbrar');
      return;
    }

    if (!this.filtersData.fecha_inicial || !this.filtersData.fecha_final) {
      this._messagesService.error('Debe seleccionar un rango de fechas');
      return;
    }

    const pipe = new DataTypePipe();

    const mensaje: string = `
      Fecha inicial: ${pipe.transform(this.filtersData.fecha_inicial)},
      Fecha final: ${pipe.transform(this.filtersData.fecha_final)}
      ${ this.filtersData.folio ? 'Folio: ' + this.filtersData.folio + ', ' : '' }
      ${ this.filtersData.carril ? 'carril: ' + this.filtersData.carril + ', ' : '' }
      ${ this.filtersData.senal ? 'Señal: ' + this.filtersData.senal + ', ' : '' }
      ${ this.filtersData.pago ? 'Pago: ' + this.filtersData.pago + ', ' : '' }
    `;

    this._messagesService.confirm(mensaje, () => {
      this.loading = true;
      this.boletosServiceSuscripcion = this._boletosService.eliminarBoletos(this.filtersData)

        .subscribe(eliminados => {
          this.loading = false;
          this._messagesService.toast(`${eliminados} boletos eliminados satisfactoriamente`);
          this.buscar();
          console.log(eliminados);
        }, err => {
          this.loading = false;
          this._messagesService.error(err);
        });

    });
  }

}

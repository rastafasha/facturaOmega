import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

// Componentes
import { FormRfcComponent } from '../form-rfc/form-rfc.component';

// Servicios
import { RfcsService } from '../../../services/rfcs.service';
import { MessagesService } from '../../../services/messages.service';
import { PagesService } from '../../../services/pages.service';

// Clases
import RFC from '../../../classes/class.rfc';

@Component({
  selector: 'app-panel-rfc',
  templateUrl: './panel-rfc.component.html',
  styles: [
  ]
})
export class PanelRfcComponent implements OnDestroy, AfterViewInit {

  columnas: string[] = ['rfc', 'contribuyente', 'email', 'telefono', 'acciones'];
  dataSource: MatTableDataSource<RFC> = new MatTableDataSource();
  loading: boolean;
  totalRegistros: number;
  totalPagina = 10;

  changeRFCsSubscripcion: Subscription = new Subscription();
  modalRFCSubscripcion: Subscription = new Subscription();
  rfcsSubscripcion: Subscription = new Subscription();
  pagesServiceSuscripcion: Subscription = new Subscription();

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  filters: any = [
    {
      name: 'contribuyente',
      type: 1,
      label: 'Nombre del contribuyente'
    }
  ];

  filtersData: any = {};

  // --------------------------------------------
  // Constructor
  // --------------------------------------------
  constructor(public dialog: MatDialog,
              private _messagesService: MessagesService,
              private _pagesService: PagesService,
              private _rfcsService: RfcsService) {} // constructor


  // --------------------------------------------
  // Inicializacion del componente
  // --------------------------------------------
  ngAfterViewInit(): void {
    // this._pagesService.openedFiltro.emit(this.filters);

    this.cargarRFCs();

    // Escuchamos cambios en el header
    this.changeRFCsSubscripcion = this._pagesService.changeRFCs
      .subscribe((rfcs: RFC[]) => this.dataSource.data = rfcs);

    // this.pagesServiceSuscripcion = this._pagesService.filtered
    //   .subscribe((filtros: any) => {
    //     this.filtersData = filtros;
    //     this.cargarRFCs();
    //   });
//
    // this.cdf.detectChanges();
  } // ngAfterViewInit


  // --------------------------------------------
  // Limpieza al destruir el componente
  // --------------------------------------------
  ngOnDestroy(): void {
    // this._pagesService.openedFiltro.emit([]);
    this.changeRFCsSubscripcion.unsubscribe();
    this.modalRFCSubscripcion.unsubscribe();
    this.rfcsSubscripcion.unsubscribe();
  } // ngOnDestroy


  // --------------------------------------------
  // Solicita los rfc's al backend
  // --------------------------------------------
  cargarRFCs(): void {
    this.loading = true;

    this.rfcsSubscripcion = merge(/* this.paginator.page */)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this._rfcsService.cargarTodos(this.filtersData);
          // return this._rfcsService.cargarTodos(this.filtersData, this.paginator.pageIndex + 1, this.totalPagina);
        }),
        map(res => {
          this.loading = false;
          this.totalRegistros = res.total_registros;
          return res.rfcs;
        }),
        catchError((err) => {
          this.loading = false;
          this._messagesService.error(err);
          return observableOf([]);
        })
      ).subscribe((rfcs: RFC[]) => this.dataSource.data = rfcs);
  } // cargarRFCs


  // --------------------------------------------
  // Abre el dialogo para agregar o editar un RFC
  // --------------------------------------------
  agregarRFC(rfc?: RFC): void {
    const dialogRef = this.dialog.open(FormRfcComponent, {
      data: { rfc },
      hasBackdrop: true,
      disableClose: true
    });

    this.modalRFCSubscripcion = dialogRef.afterClosed()
      .subscribe(nuevoRFC => {
        if (nuevoRFC) {
          this._messagesService.toast(`${nuevoRFC.clave} actualizado correctamente`, 'OK');
          this.cargarRFCs();
        }
      });
  } // agregarRFC


  // --------------------------------------------
  // Elimina un RFC
  // --------------------------------------------
  eliminarRFC(rfc: RFC): void {
    this._messagesService.confirm(`Eliminar ${rfc.clave}`, () => {
      this.loading = true;
      this.rfcsSubscripcion = this._rfcsService.eliminar(rfc)
        .subscribe(() => {
          this._messagesService.toast(`${rfc.clave} eliminado correctamente`, 'OK');
          this.cargarRFCs();
        }, err => {
          this.loading = false;
          this._messagesService.error(err);
        });
    });
  } // eliminarRFC

  // -------------------------------------------
  // Evento para paginacio movil
  // -------------------------------------------
  // cambiarPaginaMovil(pagina: number): void {
  //   this.dataSource.data = [];
  //   this.paginator.pageIndex = pagina;
  //   this.cargarRFCs();
  // } // cambiarPaginaMovil

}

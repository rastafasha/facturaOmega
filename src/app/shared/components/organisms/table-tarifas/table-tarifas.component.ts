/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Tabla de listado de tarifas
 */
import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Clases
import { Tarifa } from '../../../../classes/tarifa';

@Component({
  selector: 'organism-table-tarifas',
  templateUrl: './table-tarifas.component.html',
  styles: [
  ]
})
export class TableTarifasComponent implements OnChanges {

  /**
   * @property
   * @type {MatTableDataSource<Tarifa>}
   * @description Data de tarifas a desplegar
   */
  dataSource: MatTableDataSource<Tarifa> = new MatTableDataSource();

  /**
   * @property
   * @description Columnas de la tabla
   * @type {string[]}
   */
  columnas: string[] = ['id', 'value', 'acciones'];
  
  /**
   * @property
   * @description Total de registros a desplegar en la tabla
   * @type {number}
   */
  total: number = 0;
  
  /**
   * @property
   * @type {Tarifa[]}
   * @description Listado de tarifas a desplegar
   */
  @Input() tarifas: Tarifa[] = [];

  /**
   * @property
   * @type {boolean}
   * @description Bandera de carga para procesos asincronos
   */
  @Input() loading: boolean;

  /**
   * @property
   * @type {number}
   * @description tamanio de la pagina
   */
  pageSize: number = 10;

  /**
   * @property
   * @type {MatPaginator}
   * @description Padinador de la tabla
   */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * @property
   * @type {EventEmitter<Tarifa>}
   * @description Emisor de evento de actualizacion
   */
  @Output() onUpdate: EventEmitter<Tarifa> = new EventEmitter<Tarifa>();

  /**
   * @property
   * @type {EventEmitter<Tarifa>}
   * @description Emisor de evento de eliminacion
   */
   @Output() onDelete: EventEmitter<Tarifa> = new EventEmitter<Tarifa>();

  /**
   * @method ngOnChanges
   * @description Recarga el contenido de la tabla cada que es necesario
   */
  ngOnChanges(): void {
    this.dataSource.data = [...this.tarifas];
  }

  /**
   * @method handleUpdate
   * @description Dispara evento de actualizacion
   */
  handleUpdate(tarifa: Tarifa): void {
    this.onUpdate.emit(tarifa);
  }

  /**
   * @method handleDelete
   * @description Dispara evento de eliminacion
   */
  handleDelete(tarifa: Tarifa): void {
    this.onDelete.emit(tarifa);
  }

}

/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 * @fileoverview Tabla dinamica para listas con elementos any
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent {

  /**
   * @property
   * @type {any[]}
   * @description Data a mostrar en la tabla
   */
  @Input() data: any[] = [];

  /**
   * @property
   * @type {string[]}
   * @description Nombres de las columnas
   */
  @Input() columns: string[] = [];
  
}
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as XLSX from 'xlsx';
import moment from 'moment';
// import * as moment from 'moment';

// Servicios
import { MessagesService } from '../../../services/messages.service';
import { BoletosService } from '../../../services/boletos.service';
import ISesion from '../../../classes/interface.sesion';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-importar-boletos',
  templateUrl: './importar-boletos.component.html',
  styles: [
  ]
})
export class ImportarBoletosComponent implements OnDestroy {

  data: any[] = [];            // Data obtenida del archivo XLS
  seleccion: boolean[] = [];   // Columna checkbox
  columnas: number[] = [];     // Contador de columnas para construir tablas
  loading: boolean;

  readonly campos: any[] = [   // Campos en el mat-select
    {
      id:     'fecha',
      value:  'Fecha',
      orden:  null
    },
    {
      id:     'hora',
      value:  'Hora',
      orden:  null
    },
    {
      id:     'carril',
      value:  'Carril',
      orden:  null
    },
    {
      id:     'senal',
      value:  'Señal',
      orden:  null
    },
    {
      id:     'tarifa',
      value:  'Tarifa',
      orden:  null
    },
    {
      id:     'pago',
      value:  'Pago',
      orden:  null
    },
    {
      id:     'folio',
      value:  'Folio',
      orden:  null
    }
  ];

  @ViewChild(MatStepper) stepper: MatStepper;  // Setepper

  boletosServiceSuscripcion: Subscription = new Subscription();

  sesion: ISesion;

  // -------------------------------------------------
  // Constructor de la clase
  // -------------------------------------------------
  constructor(private _boletosService: BoletosService,
              private _messagesService: MessagesService,
              private _usuariosService: UsuariosService,
              private router: Router) {
    this.sesion = this._usuariosService.obtenerSesion();
  }


  // -------------------------------------------------
  // Limpieza de memoria
  // -------------------------------------------------
  ngOnDestroy(): void {
    this.boletosServiceSuscripcion.unsubscribe();
  } // ngOnDestroy


  // -------------------------------------------------
  // Seleccion del archivo
  // -------------------------------------------------
  paso1(evt: any) {
    // Inicializamos valores
    this.data = [];
    this.seleccion = [];
    this.columnas = [];

    this.loading = true;
    /* wire up file reader */
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) {
      this._messagesService.error('No se puede cargar múltiples archivos');
      this.loading = false;
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // Leemos el libro
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

      // Obtenemos la primera hoja
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Obtenemos la data del excel
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

      // Eliminamos filas vacias
      this.data = this.data.filter((fila: any[]) => fila.length > 0);

      for (let i = 0; i < this.data.length; i++) {
        this.seleccion.push(true);
      }

      this.loading = false;

      this.stepper.next();
    };
    reader.readAsBinaryString(target.files[0]);
  } // paso1


  // -------------------------------------------------
  // Elimina una fila del paso 2
  // -------------------------------------------------
  eliminarFila(event: MatCheckboxChange, index: number) {
    this.seleccion[index] = event.checked;
  }


  // -----------------------------------------------------
  // Omite las filas innecesarias
  // -----------------------------------------------------
  paso2(): void {
    const temporal: any[] = [];
    const temporalSeleccion: boolean[] = [];

    this.columnas = [];
    let max: number = this.columnas.length;

    // Seleccionamos solo las filas que estan checked=true
    for (let i = 0; i < this.seleccion.length; i++) {
      if (this.seleccion[i]) {
        max = Math.max(max, this.data[i].length);
        // Agregamos a temporal filas seleccionadas
        temporal.push(this.data[i]);
        // Actualizamos la nueva lista de seleccion
        temporalSeleccion.push(true);
      }
    }

    // Establecemos las columnas
    for (let i = 0; i < max; i++) {
      this.columnas.push(i);
    }

    this.seleccion = temporalSeleccion;
    this.data = temporal;

    this.stepper.next();
  } // paso2


  // -------------------------------------------------
  // Relaciona una columna con el campo del servicio
  // -------------------------------------------------
  asignarCampo(id: string, indexColumna: number): void {
    const i: number = this.campos.findIndex(campo => campo.id === id);

    if (i < 0) {
      // Si se devuelve a omitir, buscamos quien tiene ese indice y lo ponemos null
      const j: number = this.campos.findIndex(campo => campo.orden === indexColumna);
      if (j >= 0) {
        this.campos[j].orden = null;
      }
      return;
    }

    this.campos[i].orden = indexColumna;
  } // asignaCampo


  // -------------------------------------------------
  // Enviar los datos procesados al backend
  // -------------------------------------------------
  finalizar(): void {
    this.loading = true;

    const resp: any[] = [];
    this.data.forEach((row: any[]) => {
      const respRow: any = {};

      for (let i = 0; i < row.length; i++) {
        const campo: any = this.campos.find((col: any) => col.orden == i);
        if (campo) {
          respRow[`${campo.id}`] = row[i];
          // Parche para convertir el tipo fecha
          if (campo.id === 'fecha') {
            respRow[`${campo.id}`] = moment(row[i], 'DD-MM-YY');
          }
        }
      }

      resp.push(respRow);
    }); // data

    this.boletosServiceSuscripcion = this._boletosService.importar(resp)
      .subscribe(() => {
        this.loading = false;
        this._messagesService.toast('Archivo importado correctamente', 'OK');
        this.router.navigate([`/${this.sesion.path}/boletos`]);
      }, err => {
        this.loading = false;
        this._messagesService.error(err);
      });
  }

}

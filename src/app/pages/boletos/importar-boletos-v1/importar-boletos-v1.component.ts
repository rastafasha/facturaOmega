import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import * as XLSX from 'xlsx';
import moment from 'moment';
//import * as moment from 'moment';

// Servicios
import { MessagesService } from '../../../services/messages.service';
import { BoletosService } from '../../../services/boletos.service';
import ISesion from 'src/app/classes/interface.sesion';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-importar-boletos-v1',
  templateUrl: './importar-boletos-v1.component.html',
  styles: [
  ]
})
export class ImportarBoletosV1Component implements OnDestroy {

  data: any[] = [];            // Data obtenida del archivo XLS
  columnas: number[] = [];     // Contador de columnas para construir tablas
  loading: boolean;

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
  } //ngOnDestroy


  // -------------------------------------------------
  // Seleccion del archivo
  // -------------------------------------------------
  importar(evt: any) {
    // Inicializamos valores
    this.data = [];
    this.columnas = [];

    this.loading = true;
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      this._messagesService.error('No se puede cargar múltiples archivos');
      this.loading = false;
      return;
    };

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // Leemos el libro
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Obtenemos la primera hoja
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Obtenemos la data del excel
      this.data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
      // this.data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true });

      //Iniciamos a partir del indice 13 para eliminar cabeceras
      this.data.splice(0, 12);
      // Eliminamos filas vacias que no tengan la longitud de un boleto
      this.data = this.data.filter((fila: any[]) => fila.length == 14);

      // Construimos el json a enviar al backend
      let req: any[] = [];
      this.data.forEach((row: any[], fila: number) => {
        // console.log(row[0], typeof row[0]);
        //const cell_ref = XLSX.utils.encode_cell({ c: 0, r: fila });
        //console.log(XLSX.SSF.parse_date_code(row[0]));

        req.push({
          fecha: moment(row[0], 'DD-MM-YY'),
          hora: row[1],
          carril: row[2],
          senal: row[6],
          tarifa: row[8],
          pago: row[10],
          folio: row[11],
        });
      }); 

      // this.loading = false;
      // return;
            
      // Enviamos la peticion al backend
      this.boletosServiceSuscripcion = this._boletosService.importar(req)
        .subscribe(() => {
          this.loading = false;
          this._messagesService.toast('Archivo importado correctamente', 'OK');
          this.router.navigate([`/${this.sesion.path}/boletos`]);
        }, err => {    
          this.loading = false;
          this._messagesService.error(err);
        });
    };
    reader.readAsBinaryString(target.files[0]);
  } // paso1

}

import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-seleccion-rfc',
  templateUrl: './seleccion-rfc.component.html',
  styles: [
  ]
})
export class SeleccionRfcComponent {

  copia: any[] = [];

  // -------------------------------------------------
  // Constructor
  // -------------------------------------------------
  constructor(private bottomSheetRef: MatBottomSheetRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: any[]) {
    this.copia = this.data;
  }

  // -------------------------------------------------
  // Selecciona un RFC y cierra el sheet
  // -------------------------------------------------
  seleccionarRFC(rfc: any): void {
    this.bottomSheetRef.dismiss(rfc);
  } // seleccionarRFC


  // -------------------------------------------------
  // Busca un RFC en la lista
  // -------------------------------------------------
  buscar(event: any): void {
    const texto: string = event.target.value.toUpperCase();
    this.data = this.copia;

    if (texto.length > 0) {
      this.data = this.data.filter(rfc => {
        return (rfc.apellidos && rfc.apellidos.toUpperCase().indexOf(texto) >= 0) ||
               (rfc.nombres && rfc.nombres.toUpperCase().indexOf(texto) >= 0) ||
               (rfc.razon_social && rfc.razon_social.toUpperCase().indexOf(texto) >= 0) ||
               (rfc.clave && rfc.clave.toUpperCase().indexOf(texto) >= 0)     
      });
    }
  } // buscar

}

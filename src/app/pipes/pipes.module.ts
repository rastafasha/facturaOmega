import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Pipes
import { RfcPipe } from './rfc.pipe';
import { StatusFacturaPipe } from './status-factura.pipe';
import { FolioBoletoPipe } from './folio-boleto.pipe';
import { PerfilPipe } from './perfil.pipe';
import { DataTypePipe } from './data-type.pipe';
import { FormaPagoPipe } from './forma-pago.pipe';
import { FormaUsoPipe } from './forma-uso.pipe';
import { MetodoPagoPipe } from './metodo-pago.pipe';


@NgModule({
  declarations: [
    RfcPipe,
    StatusFacturaPipe,
    FolioBoletoPipe,
    PerfilPipe,
    DataTypePipe,
    FormaPagoPipe,
    FormaUsoPipe,
    MetodoPagoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RfcPipe,
    StatusFacturaPipe,
    FolioBoletoPipe,
    PerfilPipe,
    DataTypePipe,    
    FormaPagoPipe,
    FormaUsoPipe,
    MetodoPagoPipe
  ]
})
export class PipesModule { }

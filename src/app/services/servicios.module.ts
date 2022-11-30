import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Servicios propios
import { UsuariosService } from './usuarios.service';
import { RfcsService } from './rfcs.service';
import { MessagesService } from './messages.service';
import { PagesService } from './pages.service';
import { BoletosService } from './boletos.service';
import { FacturasService } from './facturas.service';
import { TarifasService } from './tarifas.service';
import { InterceptorService } from './interceptor.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    UsuariosService,
    RfcsService,
    MessagesService,
    PagesService,
    BoletosService,
    FacturasService,
    InterceptorService,
    TarifasService
  ]
})
export class ServiciosModule { }

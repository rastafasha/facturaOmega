import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FiltrosComponent } from './filtros/filtros.component';
import { FooterComponent } from './footer/footer.component';
import { AvisoPrivacidadComponent } from './aviso-privacidad/aviso-privacidad.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PaginadorMovilComponent } from './paginador-movil/paginador-movil.component';


@NgModule({
  declarations: [
    FiltrosComponent,
    FooterComponent,
    AvisoPrivacidadComponent,
    ContactoComponent,
    PaginadorMovilComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    FiltrosComponent,
    FooterComponent,
    PaginadorMovilComponent
  ]
})
export class ComponentsModule { }

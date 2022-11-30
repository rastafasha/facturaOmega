import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modulos
import { MaterialModule } from '../../../material.module';

// Componentes
import { OrganismsModule } from '../organisms/organisms.module';
import {
  TemplateFormTarifaComponent,
  TemplatePanelTarifasComponent
} from './';


@NgModule({
  declarations: [
    TemplateFormTarifaComponent,
    TemplatePanelTarifasComponent,
  ],
  imports: [
    CommonModule,
    OrganismsModule,
    MaterialModule
  ],
  exports: [
    TemplateFormTarifaComponent,
    TemplatePanelTarifasComponent,
  ]
})
export class TemplatesModule { }

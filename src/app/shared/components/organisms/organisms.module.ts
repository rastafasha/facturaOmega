import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'

// Componentes
import {
  FormTarifaComponent,
  TableTarifasComponent,
  GenericTableComponent
} from './';

// Modulos
import { MaterialModule } from '../../../material.module';
import { MoleculesModule } from '../molecules/molecules.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { AtomsModule } from '../atoms/atoms.module';

@NgModule({
  declarations: [
    FormTarifaComponent,
    TableTarifasComponent,
    GenericTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MoleculesModule,
    AtomsModule,
    PipesModule
  ],
  exports: [
    FormTarifaComponent,
    TableTarifasComponent,
    GenericTableComponent,
  ]
})
export class OrganismsModule { }

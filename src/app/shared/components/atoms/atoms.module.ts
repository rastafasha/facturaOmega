import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material/select';

import { SelectFormaPagoComponent } from './';


@NgModule({
  declarations: [
    SelectFormaPagoComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule
  ],
  exports: [
    SelectFormaPagoComponent
  ]
})
export class AtomsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Componentes propios
import { LoginComponent } from './login/login.component';

//Modulos propios
import { MaterialModule } from '../material.module';
import { ServiciosModule } from '../services/servicios.module';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrarUsuarioComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    // Modulos propios
    MaterialModule,
    ServiciosModule,
    ComponentsModule
  ]
})
export class SeguridadModule { }

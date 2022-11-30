import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes propios
import { LoginComponent } from './seguridad/login/login.component';
import { RegistrarUsuarioComponent } from './seguridad/registrar-usuario/registrar-usuario.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './seguridad/not-found/not-found.component';
import { RecuperaPasswordComponent } from './seguridad/recupera-password/recupera-password.component';
import { AvisoPrivacidadComponent } from './components/aviso-privacidad/aviso-privacidad.component';
import { ContactoComponent } from './components/contacto/contacto.component';

// Mis rutas
import {
  routesCliente,
  routesAdministrador,
  routesCapturista
} from './routes/routes';

// Configuracion
import * as config from './config/config';

// Guards
import { CapturistaGuard } from './guards/capturista.guard';
import { AdministradorGuard } from './guards/administrador.guard';
import { ClienteGuard } from './guards/cliente.guard';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registrarse',
    component: RegistrarUsuarioComponent
  },
  {
    path: 'recupera_password',
    component: RecuperaPasswordComponent
  },
  {
    path: 'aviso_privacidad',
    component: AvisoPrivacidadComponent
  },
  {
    path: 'contacto',
    component: ContactoComponent
  },
  {
    path: config.RUTA_ADMINISTRADOR,
    canActivate: [AdministradorGuard],
    component: PagesComponent,
    children: routesAdministrador
  },
  {
    path: config.RUTA_CLIENTE,
    canActivate: [ClienteGuard],
    component: PagesComponent,
    children: routesCliente
  },
  {
    path: config.RUTA_CAPTURISTA,
    canActivate: [CapturistaGuard],
    component: PagesComponent,
    children: routesCapturista
  },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

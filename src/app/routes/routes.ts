import {Routes} from '@angular/router';

// Mis componentes
import {PerfilUsuarioComponent} from '../pages/usuarios/perfil-usuario/perfil-usuario.component';
import {PanelRfcComponent} from '../pages/usuarios/panel-rfc/panel-rfc.component';
import {PanelBoletoComponent} from '../pages/boletos/panel-boleto/panel-boleto.component';
import {FormFacturaComponent} from '../pages/facturas/form-factura/form-factura.component';
import {PanelFacturaComponent} from '../pages/facturas/panel-factura/panel-factura.component';
import {PanelUsuarioComponent} from '../pages/usuarios/panel-usuario/panel-usuario.component';
import {FormUsuarioComponent} from '../pages/usuarios/form-usuario/form-usuario.component';
import {NotFoundComponent} from '../seguridad/not-found/not-found.component';
import {FacturasGeneralComponent} from '../pages/facturas/factura-general/facturas-general';
import {CambiaPasswordComponent} from '../pages/usuarios/cambia-password/cambia-password.component';
import {FormFacturaGeneralComponent} from '../pages/facturas/form-factura-general/form-factura-general.component';
import {ImportarBoletosV3Component} from '../pages/boletos/importar-boletos-v3/importar-boletos-v3.component';
import {FormularioTarifaComponent} from '../pages/tarifas/formulario-tarifa/formulario-tarifa.component';
import {PanelTarifasComponent} from '../pages/tarifas/panel-tarifas/panel-tarifas.component';
import {ComplementoComponent} from '../pages/facturas/complemento/complemento.component';
import {PagosComponent} from '../pages/facturas/complemento/pagos/pagos.component';

// Rutas para los clientes
export const routesCliente: Routes = [
  {
    path: 'perfil',
    data: {label: 'Mi perfil', icon: 'face'},
    component: PerfilUsuarioComponent
  },
  {
    path: 'cambiar_password',
    data: {label: 'Cambiar contraseña', icon: 'vpn_key'},
    component: CambiaPasswordComponent
  },
  {
    path: 'mi_rfc',
    data: {label: 'Mis RFC´s', icon: 'credit_card'},
    component: PanelRfcComponent
  },
  {
    path: 'facturas',
    data: {label: 'Mis facturas', icon: 'text_snippet'},
    component: PanelFacturaComponent
  },
  {
    path: 'factura',
    component: FormFacturaComponent
  }
];


// Rutas para los administradores
export const routesAdministrador: Routes = [
  {
    path: 'perfil',
    data: {label: 'Mi perfil', icon: 'face'},
    component: PerfilUsuarioComponent
  },
  {
    path: 'cambiar_password',
    data: {label: 'Cambiar contraseña', icon: 'vpn_key'},
    component: CambiaPasswordComponent
  },
  {
    path: 'boletos',
    data: {label: 'Boletos', icon: 'sticky_note_2'},
    component: PanelBoletoComponent
  },
  {
    path: 'facturas',
    data: {label: 'Facturas', icon: 'text_snippet'},
    component: FacturasGeneralComponent
  },
  {
    path: 'mi_rfc',
    data: {label: 'Mis receptores', icon: 'credit_card'},
    component: PanelRfcComponent
  },
  {
    path: 'factura',
    component: FormFacturaGeneralComponent
  },
  // {
  //   path: 'complementos',
  //   data: {label: 'Complementos', icon: 'text_snippet'},
  //   component: ComplementoComponent
  // },
  {
    path: 'complementos/pagos',
    data: {label: 'Pagos', icon: 'payments'},
    component: PagosComponent
  },
  {path: '', redirectTo: 'usuarios', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}
];


// Rutas para los capturistas
export const routesCapturista: Routes = [
  {
    path: 'perfil',
    data: {label: 'Mi perfil', icon: 'face'},
    component: PerfilUsuarioComponent
  },
  {
    path: 'cambiar_password',
    data: {label: 'Cambiar contraseña', icon: 'vpn_key'},
    component: CambiaPasswordComponent
  },
  {
    path: 'boletos',
    data: {label: 'Boletos', icon: 'sticky_note_2'},
    component: PanelBoletoComponent
  },
  // {
  //   path: 'facturas',
  //   data: {label: 'Facturas', icon: 'text_snippet'},
  //   component: FacturasGeneralComponent
  // },
  {
    path: 'importar_boletos',
    component: ImportarBoletosV3Component
  },
  {
    path: 'usuarios',
    data: {label: 'Usuarios', icon: 'people'},
    component: PanelUsuarioComponent
  },
  {
    path: 'usuario',
    component: FormUsuarioComponent
  },
  {
    path: 'usuario/:id',
    component: FormUsuarioComponent
  },
  {
    path: 'tarifas',
    data: {label: 'Tarifas', icon: 'attach_money'},
    component: PanelTarifasComponent
  },
  {
    path: 'tarifa/:id',
    component: FormularioTarifaComponent
  },
  {
    path: 'tarifa',
    component: FormularioTarifaComponent
  }
];

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Plugins;
import {TextMaskModule} from 'angular2-text-mask';

// Componentes propios
import {PagesComponent} from './pages.component';
import {PanelFacturaComponent} from './facturas/panel-factura/panel-factura.component';
import {PanelBoletoComponent} from './boletos/panel-boleto/panel-boleto.component';
import {FormBoletoComponent} from './boletos/form-boleto/form-boleto.component';
import {FormFacturaComponent} from './facturas/form-factura/form-factura.component';
import {PanelRfcComponent} from './usuarios/panel-rfc/panel-rfc.component';
import {FormRfcComponent} from './usuarios/form-rfc/form-rfc.component';
import {PerfilUsuarioComponent} from './usuarios/perfil-usuario/perfil-usuario.component';
import {SeleccionRfcComponent} from './usuarios/seleccion-rfc/seleccion-rfc.component';
import {ImportarBoletosComponent} from './boletos/importar-boletos/importar-boletos.component';
import {FormUsuarioComponent} from './usuarios/form-usuario/form-usuario.component';
import {PanelUsuarioComponent} from './usuarios/panel-usuario/panel-usuario.component';
import {FormularioTarifaComponent} from './tarifas/formulario-tarifa/formulario-tarifa.component';
import {FacturasGeneralComponent} from './facturas/factura-general/facturas-general';
import {RecuperaPasswordComponent} from '../seguridad/recupera-password/recupera-password.component';
import {CambiaPasswordComponent} from './usuarios/cambia-password/cambia-password.component';
import {FormFacturaGeneralComponent} from './facturas/form-factura-general/form-factura-general.component';
import {ImportarBoletosV3Component} from './boletos/importar-boletos-v3/importar-boletos-v3.component';
import {PanelTarifasComponent} from './tarifas/panel-tarifas/panel-tarifas.component';
import {ComplementoComponent} from './facturas/complemento/complemento.component';
import {FormComplementoComponent} from './facturas/form-complemento/form-complemento.component';

// Modulos propios
import {MaterialModule} from '../material.module';
import {PipesModule} from '../pipes/pipes.module';
import {ComponentsModule} from '../components/components.module';
import {TemplatesModule} from '../shared/components/templates/templates.module';
import {OrganismsModule} from '../shared/components/organisms/organisms.module';
import {AtomsModule} from '../shared/components/atoms/atoms.module';
import {FormCancelarFacturaComponent} from './facturas/form-cancelar-factura/form-cancelar-factura.component';
import { PagosComponent } from './facturas/complemento/pagos/pagos.component';

@NgModule({
  declarations: [
    PagesComponent,
    PerfilUsuarioComponent,
    PanelFacturaComponent,
    PanelBoletoComponent,
    FormBoletoComponent,
    FormFacturaComponent,
    PanelRfcComponent,
    FormRfcComponent,
    SeleccionRfcComponent,
    ImportarBoletosComponent,
    PanelUsuarioComponent,
    FormUsuarioComponent,
    FacturasGeneralComponent,
    RecuperaPasswordComponent,
    CambiaPasswordComponent,
    FormFacturaGeneralComponent,
    ImportarBoletosV3Component,
    FormularioTarifaComponent,
    PanelTarifasComponent,
    ComplementoComponent,
    FormComplementoComponent,
    FormCancelarFacturaComponent,
    PagosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    PipesModule,
    TextMaskModule,
    ComponentsModule,
    TemplatesModule,
    OrganismsModule,
    AtomsModule,
    FormsModule
  ]
})
export class PagesModule {
}

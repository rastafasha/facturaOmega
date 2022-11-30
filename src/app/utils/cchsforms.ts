import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher} from '@angular/material/core';
// import * as moment from 'moment';
import moment from 'moment';
import * as config from '../config/config';


// -------------------------------------------------------------------
// ErrorStatement más común
// -------------------------------------------------------------------
export class StandardErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


// -------------------------------------------------------------------
// Valida si dos contraseñas son iguales
// -------------------------------------------------------------------
export function passwordIgualValidator(otraPasswordEtiqueta: string) {
  let password: FormControl;
  let otraPassword: FormControl;

  return (control: FormControl) => {
    
    if (!control.parent) {
      return null;
    }

    if (!password) {
      password = control;
    }

    otraPassword = control.parent.get(otraPasswordEtiqueta) as FormControl;

    if (!otraPassword) {
      return null;
    }

    if (password.value !== otraPassword.value) {
      return {
        error: true,
        message: 'Las contraseñas no coinciden'
      };
    }   
    
    return null;
  };

} // passwordIgualValidator



// -------------------------------------------------------------------
// Valida si el periodo de facturacion es valido
// -------------------------------------------------------------------
export function peridoFacturacionValidator() {
  return (control: FormControl) => {

    const hoy = moment();

    if (!control.value) {
      return {
        error: true,
        message: 'El tipo de facturación es requerida.'
      };
    }
    
    
    if (control.value === 'mensual') {
      // Si es configuracion mensual
      return null;
      /* if (hoy.date() >= config.config_factura_mensual.periodo_facturacion.dia_inicial &&
          hoy.date() <= config.config_factura_mensual.periodo_facturacion.dia_final){
        // Si es periodo valido
        return null;
      } else {
        // Si no es periodo valido
        return {
          error: true,
          message: `La facturación mensual solo puede hacerse entre los días ${config.config_factura_mensual.periodo_facturacion.dia_inicial} 
                    y ${config.config_factura_mensual.periodo_facturacion.dia_final} del mes corriente.`
        };
      } */

    } else if (control.value === 'anual') {
      // Si la facturacion es anual
      if (hoy.date() >= config.config_factura_anual.periodo_facturacion.mes_inicial &&
          hoy.date() <= config.config_factura_anual.periodo_facturacion.mes_final){
        // Si es periodo valido
        return null;
      } else {
        // Si no es periodo valido
        return {
          error: true,
          message: `La facturación anual solo puede hacerse entre los meses ${config.config_factura_anual.periodo_facturacion.mes_inicial + 1} 
                    y ${config.config_factura_anual.periodo_facturacion.mes_final + 1} del año corriente.`
        };
      }
    }
  };

} // peridoFacturacionValidator
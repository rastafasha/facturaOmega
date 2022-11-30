import { Injectable } from '@angular/core';

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  public readonly SUCCESS: string = 'success';
  public readonly ERROR: string = 'error';
  public readonly WARNING: string = 'warning';
  public readonly INFO: string = 'info';
  public readonly QUESTION: string = 'question';

  // -------------------------------------------------
  // Constructor
  // -------------------------------------------------
  constructor(private _snackBar: MatSnackBar) {}

  // -------------------------------------------------
  // Muestra un mensaje de error
  // -------------------------------------------------
  public error(msg: any, title: string = 'Atención') {
    if (msg.status == 0) {
      Swal.fire(
        'No hay comunicación con el servidor',
        'Verifique que está conectado a Internet o reintente más tarde, si el problema continua contáctenos.',
        'error'
      );
      return;
    }

    if (typeof msg === 'string') {
      // Si el mensaje es un string
      Swal.fire(title, msg, 'error');
      return { titile: title, messages: msg }
    } else {
      // Si es una respuesta HTTP
      let mensajes: string = '';

      if (msg.error) {
        if (typeof msg.error === 'string') {
          mensajes = msg.error;
        } else {
          // Si es any
          title = msg.error.message;
          if (!msg.error.errors) {
            mensajes = msg.error.message;
          } else {
            if (msg.error.errors.code && msg.error.errors.code == 1062) {
              mensajes = 'Este registro ya existe en el sistema';
            } else {
              Object.values(msg.error.errors)
                .forEach(mensaje => mensajes += mensaje + '<br>');
            }

          }
        }
      } else {
        mensajes = msg.message;
      }

      Swal.fire(title, mensajes, 'error');
      return { title: title, messages: mensajes };
    }
  } // error

  // -----------------------------------------------------------
  // Muestra un mensaje de confirmacion para realizar una accion
  // -----------------------------------------------------------
  confirm(msg: string, action: Function, title: string = '¿Estás realmente seguro?') {
    Swal.fire({
      title: title,
      text: msg,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Si',
      confirmButtonText: 'No'
    }).then((result) => {
      if (!result.value) {
        action();
      }
    });
  } // confirm


  // -----------------------------------------------------------
  // Muestra un mensaje toast
  // -----------------------------------------------------------
  toast(msg: string,
        action: string = '',
        horizontalPosition: MatSnackBarHorizontalPosition = 'center',
        verticalPosition: MatSnackBarVerticalPosition = 'bottom',
        duration: number = 1500) {
    this._snackBar.open(
      msg,
      action,
      {
        duration,
        horizontalPosition,
        verticalPosition
      }
    );
  } // toast


  // -----------------------------------------------------------
  // Muestra un mensaje informativo
  // -----------------------------------------------------------
  info(msg: string, title: string = 'Atención', type: any = 'info') {
    Swal.fire(title, msg, type);
  }

  // -----------------------------------------------------------
  // Muestra un mensaje de confirmacion para cancelar una factura
  // -----------------------------------------------------------
  confirmCancel(msg: string, action: Function, title: string = 'Seleccione el motivo de cancelación') {
    Swal.fire({
      title,
      input: 'select',
      inputOptions: {
        '01': 'Comprobante emitido con errores con relación.',
        '02': 'Comprobante emitido con errores sin relación.',
        '03': 'No se llevó a cabo la operación.',
        '04': 'Operación nominativa relacionada en la factura global.',
      },
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Cancelar factura',
      cancelButtonText: 'Volver'
    }).then((result) => {
      if (result.value) {
        action(result.value);
      }
    });
  } // confirm

}

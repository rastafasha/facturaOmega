import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Librerias
import emailjs from 'emailjs-com';

// Clases
import ISesion from '../classes/interface.sesion';

// Servicios
import { UsuariosService } from './usuarios.service';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  readonly TOTAL_INTENTOS: number = 3;

  // ------------------------------------------------------------
  // Constructor
  // ------------------------------------------------------------
  constructor(private _usuariosService: UsuariosService,
              private _messagesService: MessagesService) {}

  
  // ------------------------------------------------------------
  // Intercepción del error
  // ------------------------------------------------------------
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
    const sesion: ISesion = this._usuariosService.obtenerSesion();
    let newReq: HttpRequest<any>;
    
    if (sesion) {
      newReq = req.clone({
        headers: req.headers.set('X-API-KEY', sesion.token)
      });
    } else {
      newReq = req.clone();
    }
    
    return next.handle(newReq).pipe(
      // Manejo de errores
      catchError((err, caught) => throwError(err))
    );
  }


  // ------------------------------------------------------------
  // Envío de correo electrónico de error
  // ------------------------------------------------------------
  enviarCorreoElectronico(err: HttpErrorResponse): void {
    const sesion: ISesion = this._usuariosService.obtenerSesion();
      
    const templateParams = {
      email: sesion && sesion.usuario ? sesion.usuario.email : 'Usuario no logueado',
      err: JSON.stringify(err)
    };
     
    emailjs.send('service_z4r7yng','template_pgqsezn', templateParams, 'user_RbI8eaYpmoUSuDN46CzSx').then();
  }

}

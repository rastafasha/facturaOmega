import {Injectable, ViewChild} from '@angular/core';
import {UsuariosService} from "./usuarios.service";
import {Router} from "@angular/router";
import ISesion from "../classes/interface.sesion";
import {MatSidenav} from "@angular/material/sidenav";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  private session: ISesion;
  @ViewChild('filtro') filtro: MatSidenav;
  @ViewChild('menu') menu: MatSidenav;

  constructor(
    private userService: UsuariosService,
    private router: Router
  ) {
    this.session = userService.obtenerSesion();
  }

  public GoTo(route): void {
    this.router.navigate([`${this.session.path}/${route}`]);
  }

  public RefreshMenu(): void {
    if (this.IsMobile()) {
      this.filtro.close();
      this.menu.close();
    }
  }

  public IsMobile(): boolean {
    return window.screen.width < 575.98;
  }
}

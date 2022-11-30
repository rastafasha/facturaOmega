/**
 * @author Hugo Gionori Soto Miguel
 * @version 1.0.0
 */
import {Component} from '@angular/core';
import {RoutingService} from '../../../services/routing.service';

@Component({
  selector: 'app-complemento',
  templateUrl: './complemento.component.html',
  styles: []
})
export class ComplementoComponent {

  constructor(
    private routingService: RoutingService
  ) {
  }

  public Goto(route): void {
    this.routingService.GoTo(route);
  }
}

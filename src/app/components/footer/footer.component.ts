import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: [
  ]
})
export class FooterComponent {

  hoy: Date = new Date();
  @Input() bg: string = 'bg-white';

}

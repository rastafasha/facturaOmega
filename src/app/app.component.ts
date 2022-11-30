import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private titleService: Title,
              @Inject(DOCUMENT) document: any) {
    this.titleService.setTitle(environment.title);        
    
    // Implementamos seguridad SSL
    if (environment.production) {
      let href: string = document.location.href;
      if (href.startsWith('http://')) {
        href = href.replace('http://', 'https://');
        document.location.href = href;      
      }      
    }
  }
}
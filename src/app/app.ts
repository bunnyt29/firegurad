import { Component, signal } from '@angular/core';
import {NavigationStart, Router, RouterEvent, RouterOutlet} from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import {NavigationMenu} from './shared/components/navigation-menu/navigation-menu';

@Component({
  selector: 'app-root',
  imports: [
    GoogleMapsModule,
    RouterOutlet,
    NavigationMenu
  ],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fireguardapp');
  hideNavbar = false;
  private hiddenRoutes: string[] = ['/welcome'];

  constructor(
    private router: Router
  )
  {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hideNavbar =
          this.hiddenRoutes.includes(event.url)
      }
    });
  }

}

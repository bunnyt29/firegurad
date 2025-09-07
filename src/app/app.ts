import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { NavigationMenu } from './shared/components/navigation-menu/navigation-menu';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import { AuthService } from './pages/auth/services/auth';

@Component({
  selector: 'app-root',
  imports: [GoogleMapsModule, RouterOutlet, NavigationMenu],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('fireguardapp');
  private hiddenRoutes: string[] = ['/welcome', '/profile/edit'];

  hideNavbar = false;

  constructor(private router: Router, protected authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = this.hiddenRoutes.includes(event.url);
      }
    });

    CapacitorApp.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      if (!event.url.includes('/app/')) return;

      const path = event.url.split('/app/').pop();
      if (path) {
        this.router.navigateByUrl('/' + path);
      }
    });
  }
}

import {Component, OnInit, signal} from '@angular/core';
import { NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { NavigationMenu } from './shared/components/navigation-menu/navigation-menu';
import { App as CapacitorApp, URLOpenListenerEvent } from '@capacitor/app';
import {AuthService} from './pages/auth/services/auth';
import { setupNotifications } from './shared/service/notification.service';

@Component({
  selector: 'app-root',
  imports: [GoogleMapsModule, RouterOutlet, NavigationMenu],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.scss',
})
export class App implements OnInit{
  protected readonly title = signal('fireguardapp');
  hideNavbar = false;
  private hiddenRoutes: string[] = ['/welcome'];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
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

    setupNotifications();
  }

  async ngOnInit() {
    await this.authService.loadToken();
  }
}

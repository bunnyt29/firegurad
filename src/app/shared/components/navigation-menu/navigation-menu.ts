import { Component, OnInit, Signal } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../../pages/auth/services/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'navigation-menu',
  imports: [RouterLink],
  templateUrl: './navigation-menu.html',
  standalone: true,
  styleUrl: './navigation-menu.scss',
})
export class NavigationMenu {
  isLogged: Signal<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.isLogged = this.authService.isAuthenticated;
    console.log(this.isLogged());
  }

  get isBecomeVolunteerRoute(): boolean {
    return this.router.url === '/become-volunteer';
  }

  redirectToGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  logout() {
    this.authService.logout();
    console.log(this.authService.token());
  }
}

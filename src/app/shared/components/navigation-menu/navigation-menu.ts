import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'navigation-menu',
  imports: [
    RouterLink
  ],
  templateUrl: './navigation-menu.html',
  standalone: true,
  styleUrl: './navigation-menu.scss'
})
export class NavigationMenu {
  redirectToGoogle() {
    window.location.href = '/api/auth/google';
  }
}

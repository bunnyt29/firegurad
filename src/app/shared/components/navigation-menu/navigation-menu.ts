import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../pages/auth/services/auth';

@Component({
  selector: 'navigation-menu',
  imports: [
    RouterLink
  ],
  templateUrl: './navigation-menu.html',
  standalone: true,
  styleUrl: './navigation-menu.scss'
})
export class NavigationMenu implements OnInit {
  isLogged: boolean = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication() : void {
    this.isLogged = this.authService.isAuthenticated();
  }

  redirectToGoogle() {
    window.location.href = '/api/auth/google';
  }
}

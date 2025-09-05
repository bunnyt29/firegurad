import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  standalone: true,
  styleUrl: './welcome.scss',
})
export class Welcome {
  redirectToGoogle() {
    window.location.href = `${environment.apiUrl}/auth/google`;
  }
}

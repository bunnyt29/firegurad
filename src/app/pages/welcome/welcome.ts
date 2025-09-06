import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { environment } from '../../../environments/environment';
import {Preferences} from '@capacitor/preferences';

const ONBOARD_KEY = 'welcome_seen';


@Component({
  selector: 'app-welcome',
  imports: [RouterLink],
  templateUrl: './welcome.html',
  standalone: true,
  styleUrl: './welcome.scss',
})
export class Welcome {
  private router = inject(Router);

  async markSeenAndGo(to: string) {
    await Preferences.set({ key: ONBOARD_KEY, value: '1' });
    this.router.navigateByUrl(to);
  }

  async redirectToGoogle() {
    await Preferences.set({ key: ONBOARD_KEY, value: '1' });
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  async skip() {
    await Preferences.set({ key: ONBOARD_KEY, value: '1' });
    this.router.navigateByUrl('/map');
  }

}

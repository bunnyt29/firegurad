import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly TOKEN_KEY = 'token';

  public readonly token = signal<string | null>(null);

  public readonly isAuthenticated = computed(() => this.token() != null);

  async loadSavedToken() {
    const token = await Preferences.get({ key: this.TOKEN_KEY });
    this.token.set(token.value);
  }

  async saveToken(token: string | null) {
    this.token.set(token);

    if (token == null) await Preferences.remove({ key: this.TOKEN_KEY });
    else await Preferences.set({ key: this.TOKEN_KEY, value: token });
  }

  logout() {
    this.saveToken(null);
  }
}

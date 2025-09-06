import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly TOKEN_KEY = 'token';

  private token: string | null = null;

  async loadSavedToken() {
    const token = await Preferences.get({ key: this.TOKEN_KEY });
    this.token = token.value;
  }

  async saveToken(token: string | null) {
    this.token = token;

    if (token == null) await Preferences.remove({ key: this.TOKEN_KEY });
    else await Preferences.set({ key: this.TOKEN_KEY, value: token });
  }

  isAuthenticated(): boolean {
    return this.token != null;
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.saveToken(null);
  }
}

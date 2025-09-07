import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly USER_TYPE_KEY = 'user_type';
  public readonly TOKEN_KEY = 'token';

  public readonly userType = signal<string | null>(null);
  public readonly token = signal<string | null>(null);

  public readonly isFireDepartment = computed(() => this.userType() === 'FIRE_DEPARTMENT');
  public readonly isAuthenticated = computed(() => this.token() != null);

  public initialLoad: Promise<void>;

  constructor() {
    this.initialLoad = this.loadSaved();
  }

  async loadSaved() {
    const token = await Preferences.get({ key: this.TOKEN_KEY });
    this.token.set(token.value);

    const userType = await Preferences.get({ key: this.USER_TYPE_KEY });
    this.userType.set(userType.value);
  }

  async saveAuth(token: string | null, userType: string | null) {
    this.token.set(token);
    this.userType.set(userType);

    if (token == null) await Preferences.remove({ key: this.TOKEN_KEY });
    else await Preferences.set({ key: this.TOKEN_KEY, value: token });

    if (userType == null) await Preferences.remove({ key: this.USER_TYPE_KEY });
    else await Preferences.set({ key: this.USER_TYPE_KEY, value: userType });
  }

  logout() {
    this.saveAuth(null, null);
  }
}

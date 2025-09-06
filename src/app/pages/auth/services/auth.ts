import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authPath = environment.apiUrl + "/auth";
  private cachedToken: string | null = null;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  async saveToken(token: any) {
    this.cachedToken = token;
    await Preferences.set({ key: 'token', value: JSON.stringify({ access_token: token }) });
  }

  loadToken() {
    const token = this.cookieService.get('auth');
    this.cachedToken = token ? token : null;
  }

  // async loadToken() {
  //   const ret = await Preferences.get({ key: 'token' });
  //   if (ret.value) {
  //     try {
  //       const parsed = JSON.parse(ret.value);
  //       this.cachedToken = parsed.access_token ?? null;
  //     } catch {
  //       this.cachedToken = null;
  //     }
  //   }
  // }

  // getTokenSync(): string | null {
  //   return this.cachedToken;
  // }

  isAuthenticated(): boolean {
    if (this.cookieService === undefined) {
      return false;
    } else {
      return !!this.cookieService.get('auth');
    }
  }

  getToken(): string | null {
    return this.cookieService.get('auth') || null;
  }
}

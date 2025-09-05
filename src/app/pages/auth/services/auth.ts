import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authPath = environment.apiUrl + "/auth"
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  isAuthenticated(): boolean {
    if (this.cookieService === undefined) {
      return false;
    } else {
      return !!this.cookieService.get('auth');
    }
  }

  logout(): Observable<any> {
    return this.http.get<any>(this.authPath + '/logout');
  }
}

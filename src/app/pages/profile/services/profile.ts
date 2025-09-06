import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userPath = environment.apiUrl + "/user"

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get<any>(this.userPath);
  }

  edit(data:any) {
    return this.http.patch(this.userPath + '/edit', data);
  }

  getCertificate(userId: string) {
    return this.http.get(`${this.userPath}/certificate/${userId}`, {
      responseType: 'blob'
    });
  }
}

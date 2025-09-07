import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireAttendanceService {
  private firesPath = environment.apiUrl + '/fire-attendance';

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get<any>(this.firesPath);
  }

  setAttendance(fireId: string): Observable<any> {
    const url = `${this.firesPath}/isAttending/${encodeURIComponent(fireId)}`;
    return this.http.post(url, {}); // empty body
  }

  getAttendance(fireId: string): Observable<any> {
    return this.http.get<any>(`${this.firesPath}/${fireId}`);
  }
}

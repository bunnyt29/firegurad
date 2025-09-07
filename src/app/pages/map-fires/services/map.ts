import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private firesPath = environment.apiUrl + "/fires"

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<any> {
    return this.http.get<any>(this.firesPath);
  }

  confirmFire(fireId: string): Observable<any> {
    return this.http.post<any>(this.firesPath + '/confirm/' + fireId, {});
  }

  setFireIsUnderControl(fireId: string): Observable<any> {
    return this.http.post<any>(this.firesPath + '/isUnderControl/' + fireId, {});
  }

  removeFire(fireId: string): Observable<any> {
    return this.http.delete<any>(this.firesPath + '/remove/' + fireId, {});
  }

  createFire(coords: { lat: number; long: number }): Observable<any> {
    return this.http.post<any>(this.firesPath + '/report', coords);
  }
}

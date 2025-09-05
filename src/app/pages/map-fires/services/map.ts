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
}

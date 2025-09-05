import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Profile {
  private userPath = environment.apiUrl + "/profiles"

  constructor(
    private http: HttpClient
  ) { }

  get(profileId: string): Observable<any> {
    return this.http.get<any>(this.userPath + '/' + profileId);
  }

  edit(id:string, data:any) {
    return this.http.put(this.userPath + '/' + id, data);
  }
}

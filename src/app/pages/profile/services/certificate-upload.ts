import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateUploadService {
  private url = `${environment.apiUrl}/user/certificate/upload`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('certificate', file);

    const req = new HttpRequest('POST', this.url, form, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}

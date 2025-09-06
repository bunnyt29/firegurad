import { Geolocation } from '@capacitor/geolocation';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

export interface SpherePoint {
  lat: number;
  long: number;
}

@Injectable({
  providedIn: 'root',
})
export class GPSService {
  readonly location = this.getCurrentLocation();

  private async getPermissions() {
    try {
      let permStatus = await Geolocation.checkPermissions();

      if (permStatus.location === 'prompt') {
        permStatus = await Geolocation.requestPermissions({
          permissions: ['location'],
        });
      }

      return permStatus.location === 'granted';
    } catch {
      return false;
    }
  }

  private async getIpLocation(): Promise<SpherePoint> {
    const req = await fetch(`${environment.apiUrl}/geocode/me`);
    return req.json();
  }

  private async getCurrentLocation() {
    const hasPermissions = await this.getPermissions();
    if (!hasPermissions) return this.getIpLocation();

    for (let i = 0; i < 10; i++) {
      try {
        const pos = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        return {
          lat: pos.coords.latitude,
          long: pos.coords.longitude,
        };
      } catch {}
    }

    return this.getIpLocation();
  }
}

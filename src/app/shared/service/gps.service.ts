import { Geolocation } from '@capacitor/geolocation';
import { environment } from '../../../environments/environment';

export interface SpherePoint {
  lat: number;
  long: number;
}

async function getIpLocation(): Promise<SpherePoint> {
  const req = await fetch(`${environment.apiUrl}/geocode/me`);
  return req.json();
}

export async function getCurrentLocation() {
  let permStatus = await Geolocation.checkPermissions();

  if (permStatus.location === 'prompt') {
    permStatus = await Geolocation.requestPermissions({
      permissions: ['location'],
    });
  }

  if (permStatus.location !== 'granted') return getIpLocation();

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

  return getIpLocation();
}

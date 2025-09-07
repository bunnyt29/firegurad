import {AuthService} from '../../../auth/services/auth';

declare const google: any;

import {
  AfterViewInit,
  Component,
  OnInit, Signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MapService } from '../../services/map';
import { FireAttendanceService } from '../../services/fire-attendance';
import { GPSService } from '../../../../shared/service/gps.service';
import { NotificationService } from '../../../../shared/service/notification.service';

@Component({
  selector: 'app-map',
  imports: [GoogleMap, MapMarker],
  templateUrl: './map.html',
  standalone: true,
  styleUrl: './map.scss',
})
export class FireMapComponent implements AfterViewInit {
  @ViewChild('gmap', { static: false }) gmap!: GoogleMap;
  @ViewChild('infoWindowTpl', { static: true }) infoTpl!: TemplateRef<any>;

  infoWindow!: google.maps.InfoWindow;
  isLogged: Signal<boolean>;

  private volunteersCache: Map<number | string, { certified: number; notCertified: number }> = new Map();
  private lastOpenedFireId: string | number | null = null;

  options: google.maps.MapOptions = {
    mapId: 'c15beabe0a1eaeec65382fa9',
    center: { lat: 41.7435, lng: 24.3939 },
    zoom: 10,
  };

  constructor(
    private mapService: MapService,
    private fireAttendanceService: FireAttendanceService,
    private vcr: ViewContainerRef,
    private gpsService: GPSService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.isLogged = this.authService.isAuthenticated;
  }

  async ngAfterViewInit(): Promise<void> {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    this.infoWindow = new google.maps.InfoWindow({
      disableAutoPan: false,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(0, -6)
    });

    this.mapService.get().subscribe((res: any[]) => {
      if (!res?.length) return;

      const bounds = new google.maps.LatLngBounds();

      const lastNotification = this.notificationService.lastClickedNotification;
      const clickedFireId =
        lastNotification && lastNotification.type === 'fire' && lastNotification.fireId;

      res.forEach((item: any) => {
        const position = { lat: item.lat, lng: item.long };

        const fireImage = document.createElement('img');
        fireImage.src = item.isConfirmed
          ? '/shared/fire-approved.png'
          : '/shared/fire-not-approved.png';

        const marker = new AdvancedMarkerElement({
          map: this.gmap.googleMap!,
          position,
          content: fireImage,
          title: `${item.area} • ${item.source}`,
        });

        const view = this.vcr.createEmbeddedView(this.infoTpl, { item, position });
        view.detectChanges();

        const host = document.createElement('div');
        view.rootNodes.forEach((n) => host.appendChild(n));

        marker.addListener('click', () => {
          this.infoWindow.setContent(host);
          this.infoWindow.open({ anchor: marker, map: this.gmap.googleMap! });

          this.lastOpenedFireId = item.id ?? null;

          if (item?.id != null) {
            const cached = this.volunteersCache.get(item.id);
            if (cached) {
              item.certifiedCount = cached.certified;
              item.notCertifiedCount = cached.notCertified;
              item.volunteersLabel = String(cached.certified + cached.notCertified);
              item.attendanceLoading = false;
              view.detectChanges();
            } else {
              item.attendanceLoading = true;
              view.detectChanges();

              this.fireAttendanceService.getAttendance(item.id).subscribe({
                next: (r: any) => {
                  const certified = Number(r?.certifiedCount ?? 0);
                  const notCertified = Number(r?.notCertifiedCount ?? 0);

                  this.volunteersCache.set(item.id, { certified, notCertified });

                  if (this.lastOpenedFireId === item.id) {
                    item.certifiedCount = certified;
                    item.notCertifiedCount = notCertified;
                    item.volunteersLabel = String(certified + notCertified);
                    item.attendanceLoading = false;
                    view.detectChanges();
                  }
                },
                error: () => {
                  if (this.lastOpenedFireId === item.id) {
                    item.attendanceLoading = false;
                    item.volunteersLabel = '—';
                    view.detectChanges();
                  }
                }
              });
            }
          }
        });

        if (item.id === clickedFireId) {
          google.maps.event.trigger(marker, 'click', {});
        }

        bounds.extend(position);
      });

      this.gmap.googleMap!.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });

      this.gmap.googleMap!.addListener('click', () => this.infoWindow.close());

      this.gpsService.location.then(({ lat, long }) => {
        const pinElement = document.createElement('div');
        pinElement.classList.add('your-location-pin');

        new AdvancedMarkerElement({
          map: this.gmap.googleMap!,
          position: new google.maps.LatLng(lat, long),
          content: pinElement,
          title: 'Your location',
        });
      });
    });
  }

  goTo(item: any) {
    if (!item?.id) {
      console.warn('No fireId on item:', item);
      return;
    }

    this.fireAttendanceService.setAttendance(item.id).subscribe({
      next: () => {
        alert('Беше отбелязан като участник!');
      },
      error: (err) => {
        console.error('Error setting attendance', err);
        alert('Неуспешно отбелязване.');
      },
    });
  }
}

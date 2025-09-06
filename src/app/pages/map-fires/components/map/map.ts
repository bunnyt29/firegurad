import {
  AfterViewInit,
  Component,
  OnInit,
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
export class Map implements AfterViewInit {
  @ViewChild('gmap', { static: false }) gmap!: GoogleMap;
  @ViewChild('infoWindowTpl', { static: true }) infoTpl!: TemplateRef<any>;

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
    private notificationService: NotificationService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    this.mapService.get().subscribe((res: any) => {
      if (!res?.length) return;

      const bounds = new google.maps.LatLngBounds();

      const lastNotification = this.notificationService.lastClickedNotification;
      const clickedFireId =
        lastNotification && lastNotification.type === 'fire' && lastNotification.fireId;

      res.forEach((item: any) => {
        const position = { lat: item.lat, lng: item.long };

        const parser = new DOMParser();
        const pinSvgString =
          '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64" fill="none">' +
          '  <path d="M32 4C26 14 18 20 18 32c0 10 6 20 14 24 8-4 14-14 14-24 0-12-8-18-14-28z" fill="#FF6A00"/>' +
          '  <path d="M32 20c-4 6-8 10-8 16 0 6 4 12 8 14 4-2 8-8 8-14 0-6-4-10-8-16z" fill="#FFD166"/>' +
          '</svg>';
        const pinSvg = parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;

        const marker = new AdvancedMarkerElement({
          map: this.gmap.googleMap!,
          position,
          content: pinSvg,
          title: `${item.area} • ${item.source}`,
        });

        const view = this.vcr.createEmbeddedView(this.infoTpl, { item, position });
        view.detectChanges();

        const host = document.createElement('div');
        view.rootNodes.forEach((n) => host.appendChild(n));

        const info = new google.maps.InfoWindow({ content: host });
        marker.addListener('click', () => info.open({ anchor: marker, map: this.gmap.googleMap! }));

        if (item.id === clickedFireId) marker.click();

        bounds.extend(position);
      });

      this.gmap.googleMap!.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });

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
        // optionally refresh volunteers count
        item.volunteersLabel = (item.volunteersLabel || 0) + 1;
      },
      error: (err) => {
        console.error('Error setting attendance', err);
        alert('Неуспешно отбелязване.');
      },
    });
  }
}

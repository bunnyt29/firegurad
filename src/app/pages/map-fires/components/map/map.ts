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
  @ViewChild('addFireTmpl', { static: true }) addFireTmpl!: TemplateRef<any>;

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
    protected authService: AuthService
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

    const addFireMarker = new AdvancedMarkerElement({
      map: this.gmap.googleMap!,
      content: document.createElement('p'),
      title: '',
    });

    const addFireView = this.vcr.createEmbeddedView(this.addFireTmpl, {
      addFlame: () => {
        const { lat, lng } = addFireMarker.position!;

        this.mapService.createFire({
          lat: typeof lat === 'function' ? lat() : lat ?? 0,
          long: typeof lng === 'function' ? lng() : lng ?? 0,
        }).subscribe({
          next: fire => {
            this.infoWindow.close();
            addFlame(fire, true);
          }
        });
      }
    });

    addFireView.detectChanges();

    const addFireHost = document.createElement('div');
    addFireView.rootNodes.forEach((n) => addFireHost.appendChild(n));

    this.gmap.mapClick.subscribe({
      next: event => {
        if (this.infoWindow.isOpen) {
          this.infoWindow.close()
          return;
        }

        if (!this.authService.isFireDepartment()) return;

        addFireMarker.position = event.latLng;

        this.infoWindow.setContent(addFireHost);
        this.infoWindow.open({ map: this.gmap.googleMap, anchor: addFireMarker });
      }
    });

    const bounds = new google.maps.LatLngBounds();

    const addFlame = (item: any, shouldClick = false) => {
      const position = { lat: item.lat, lng: item.long };

      const fireImage = document.createElement('img');
      fireImage.src = item.isConfirmed
        ? '/shared/fire-approved.png'
        : '/shared/fire-not-approved.png';

      const marker = new AdvancedMarkerElement({
        map: this.gmap.googleMap!,
        position,
        content: fireImage,
        title: `${item.area} • ${item.source === 'FIRE_DEPARTMENT' ? 'Пожарна' : 'НАСА Сателит'}`,
        zIndex: 2
      });

      item.image = fireImage;

      const view = this.vcr.createEmbeddedView(this.infoTpl, { item, position });
      view.detectChanges();

      item.view = view;

      const host = document.createElement('div');
      view.rootNodes.forEach((n) => host.appendChild(n));

      item.remove = () => {
        this.infoWindow.close();
        marker.remove();
      }

      marker.addListener('click', () => {
        this.infoWindow.setContent(host);
        this.infoWindow.open({ anchor: marker, map: this.gmap.googleMap! });

        this.lastOpenedFireId = item.id ?? null;

        if (!('isAttending' in item)) {
          this.fireAttendanceService.getIsAttending(item?.id).subscribe({
            next: value => {
              item.isAttending = value;
              view.detectChanges();
            }
          });
        }

        item.loadVolunteers = () => {
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

        if (item?.id != null) {
          const cached = this.volunteersCache.get(item.id);
          if (cached) {
            item.certifiedCount = cached.certified;
            item.notCertifiedCount = cached.notCertified;
            item.volunteersLabel = String(cached.certified + cached.notCertified);
            item.attendanceLoading = false;
            view.detectChanges();
          } else {
            item.loadVolunteers();
          }
        }
      });

      if (shouldClick) {
        google.maps.event.trigger(marker, 'click', {});
      }

      bounds.extend(position);
    }

    this.mapService.get().subscribe((res: any[]) => {
      if (!res?.length) return;

      const lastNotification = this.notificationService.lastClickedNotification;
      const clickedFireId =
        lastNotification && lastNotification.type === 'fire' && lastNotification.fireId;

      res.forEach(item => addFlame(item, item.id === clickedFireId));

      this.gmap.googleMap!.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });

      this.gpsService.location.then(({ lat, long }) => {
        const pinElement = document.createElement('div');
        pinElement.classList.add('your-location-pin');

        new AdvancedMarkerElement({
          map: this.gmap.googleMap!,
          position: new google.maps.LatLng(lat, long),
          content: pinElement,
          title: 'Твоята Локация',
          zIndex: 0
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
        item.isAttending = true;
        item.loadVolunteers();
        item.view.detectChanges();
      },
      error: (err) => {
        console.error('Error setting attendance', err);
        alert('Неуспешно отбелязване.');
      },
    });
  }

  stopGoingTo(item: any) {
    this.fireAttendanceService.removeAttendance(item.id).subscribe({
      next: () => {
        item.isAttending = false;
        item.loadVolunteers();
        item.view.detectChanges();
      },
      error: (err) => {
        console.error('Error setting attendance', err);
        alert('Неуспешно отбелязване.');
      },
    });
  }

  confirmFire(item: any) {
    this.mapService.confirmFire(item.id).subscribe({
      next: () => {
        item.isConfirmed = true;
        item.source = 'FIRE_DEPARTMENT';
        item.image.src = '/shared/fire-approved.png';
        item.view.detectChanges();
      }
    })
  }

  setFireIsUnderControl(item: any) {
    this.mapService.setFireIsUnderControl(item.id).subscribe({
      next: () => {
        item.isUnderControl = true;
        item.view.detectChanges();
      }
    })
  }

  removeFire(item: any) {
    this.mapService.removeFire(item.id).subscribe({
      next: () => {
        item.remove();
      }
    })
  }
}

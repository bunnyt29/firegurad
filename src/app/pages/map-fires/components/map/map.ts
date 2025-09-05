import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {MapService} from '../../services/map';

@Component({
  selector: 'app-map',
  imports: [
    GoogleMap,
    MapMarker
  ],
  templateUrl: './map.html',
  standalone: true,
  styleUrl: './map.scss'
})
export class Map implements AfterViewInit {
  @ViewChild('gmap', { static: false }) gmap!: GoogleMap;

  options: google.maps.MapOptions = {
    mapId: 'c15beabe0a1eaeec65382fa9',
    center: { lat: 41.7435, lng: 24.3939 }, // Devin, default center
    zoom: 10,
  };

  constructor(private mapService: MapService) {}

  async ngAfterViewInit(): Promise<void> {
    const { AdvancedMarkerElement, PinElement } =
      (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    this.mapService.get().subscribe((res: any) => {
      if (!res?.length) return;

      const bounds = new google.maps.LatLngBounds();

      res.forEach((item: any) => {
        const position = { lat: item.lat, lng: item.long };

        // const icon = document.createElement('img');
        // icon.src = '../../../../../assets/images/google-maps-custom-icon.png';
        // icon.style.width = '40px';
        // icon.style.height = '40px';

        const parser = new DOMParser();

        const pinSvgString = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64" fill="none">\n' +
          '  <!-- outer flame -->\n' +
          '  <path d="M32 4C26 14 18 20 18 32c0 10 6 20 14 24 8-4 14-14 14-24 0-12-8-18-14-28z"\n' +
          '        fill="#FF6A00"/>\n' +
          '  <!-- inner flame -->\n' +
          '  <path d="M32 20c-4 6-8 10-8 16 0 6 4 12 8 14 4-2 8-8 8-14 0-6-4-10-8-16z"\n' +
          '        fill="#FFD166"/>\n' +
          '</svg>';

        const pinSvg =
          parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;

        const marker = new AdvancedMarkerElement({
          map: this.gmap.googleMap!,
          position,
          content: pinSvg,
          title: `${item.area} • ${item.source}`
        });

        const info = new google.maps.InfoWindow({
          content: `
            <div style="min-width:220px;">
              <strong>${item.area}</strong><br/>
              Източник: ${item.source}<br/>
              Статус: ${item.isConfirmed ? 'Потвърден от пожарната' : 'Непотвърден'}<br/>
              Кординати: ${position.lat.toFixed(4)}, Lng: ${position.lng.toFixed(4)}
            </div>`
        });
        marker.addListener('click', () => info.open({ anchor: marker, map: this.gmap.googleMap! }));

        bounds.extend(position);
      });

      this.gmap.googleMap!.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    });
  }
}

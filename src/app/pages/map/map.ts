import { Component } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';

@Component({
  selector: 'app-map',
  imports: [
    GoogleMap
  ],
  templateUrl: './map.html',
  standalone: true,
  styleUrl: './map.scss'
})
export class Map {
  options: google.maps.MapOptions = {
    mapId: "c15beabe0a1eaeec65382fa9",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };
}

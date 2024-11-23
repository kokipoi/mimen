import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private coordinates = new BehaviorSubject<{lat: number, lng: number} | null>(null);
  currentCoordinates = this.coordinates.asObservable();

  constructor() {}

  setCoordinates(lat: number, lng: number) {
    this.coordinates.next({lat, lng});
  }
}

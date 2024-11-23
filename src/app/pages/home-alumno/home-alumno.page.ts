import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EmpService} from '../../services/emp.service';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-home-alumno',
  templateUrl: './home-alumno.page.html',
  styleUrls: ['./home-alumno.page.scss'],
})
export class HomeAlumnoPage implements OnInit, OnDestroy{
  username: string = '';
  map: any;
  marker: any;
  emps: any[] = [];
  error: string | null = null;
  currentLat: number = -33.448839; // Coordenada inicial (por ejemplo, CDMX)
  currentLng: number = -70.670361 ; // Coordenada inicial

  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController,
    private empService: EmpService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.checkAuthStatus();
    this.loadMap();
    this.cargarEmps();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  cargarEmps() {
    this.empService.getEmps().subscribe({
      next: (data) => {
        this.emps = data;
      },
      error: (err) => {
        this.error = 'Error al cargar los registros';
        console.error('Error:', err);
      }
    });
  }

  checkAuthStatus() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Usamos el nombre del usuario de la base de datos
        this.username = user.nombre || 'Alumno';
      } else {
        const user = this.authService.getUser();
        if (user) {
          this.username = user.nombre || 'Alumno';
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }
  loadMap() {
    const mapOptions = {
      //center: { lat: -33.448839, lng: -70.670361 }, // Coordenadas iniciales (Santiago, Chile)
      center: new google.maps.LatLng(this.currentLat, this.currentLng),

      zoom: 19,
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    this.marker = new google.maps.Marker({
      position: { lat: this.currentLat, lng: this.currentLng },
      map: this.map,
      title: 'Ubicación temporal',
    });

  }
  // Actualiza el marcador en el mapa
  updateMarker(lat: number, lng: number) {
    const newPosition = new google.maps.LatLng(lat, lng);

    // Mueve el marcador existente a la nueva posición
    this.marker.setPosition(newPosition);
    this.map.setCenter(newPosition);
  }

  // Llama a la API para obtener las coordenadas del emprendimiento
  fetchCoordinates(nombreEmp: string) {
    this.http
      .get<any>(`http://localhost/mimen-main/api.php?action=get-emp&nombre=${nombreEmp}`)
      .subscribe((data) => {
        if (data.lat && data.lng) {
          this.updateMarker(data.lat, data.lng);
        } else {
          console.error('Coordenadas no encontradas para:', nombreEmp);
        }
      });
  }

  async logout() {
    this.authService.logout();
    await this.presentToast('Has cerrado sesión', 'bottom', 3000, 'success');
    this.router.navigate(['/login']);
  }

  async presentToast(message: string, position: 'top' | 'bottom', duration: number, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });
    toast.present();
  }
  doRefresh(event: any) {
    this.cargarEmps();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }


  async openProfileMenu() {
    await this.menuController.open('end');
  }
}
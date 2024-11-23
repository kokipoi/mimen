import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creaemp',
  templateUrl: './creaemp.page.html',
  styleUrls: ['./creaemp.page.scss'],
})
export class CreaempPage implements OnInit,OnDestroy {
  username: string = '';
  nombreemp: string='';
  numero: string='';
  lat: number=0.0;
  lng: number=0.0;

  private userSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private menuController: MenuController
  ) { }

  ngOnInit() {
    this.checkAuthStatus();
    this.clearFields();

  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  clearFields() {
    this.nombreemp = '';
    this.numero = '';
    this.lat=0;
    this.lng=0;

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

  async openProfileMenu() {
    await this.menuController.open('end');
  }
  async signUpemp() {
    // Verificación de campos vacíos
    if (!this.nombreemp || !this.numero) {
      await this.presentToast('Por favor, complete todos los campos', 'bottom', 3000, 'danger');
      return;
    }

    // Intentar registro
    this.authService.registeremp(this.nombreemp, this.numero,this.lat, this.lng).subscribe({
      next: async (response) => {
        if (response.success) {
          this.router.navigate(['/creaobj']);
          await this.presentToast('Registro exitoso', 'bottom', 3000, 'success');

        } else {
          await this.presentToast('FALLO', 'bottom', 3000, 'danger');
        }
      }
    });
  }


}

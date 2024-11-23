import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creaobj',
  templateUrl: './creaobj.page.html',
  styleUrls: ['./creaobj.page.scss'],
})
export class CreaobjPage implements OnInit,OnDestroy {
  username: string = '';
  nombreobj: string='';
  descobj: string='';
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
    this.nombreobj = '';
    this.descobj = '';
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
  async signUpobj() {
    // Verificación de campos vacíos
    if (!this.nombreobj || !this.descobj) {
      await this.presentToast('Por favor, complete todos los campos', 'bottom', 3000, 'danger');
      return;
    }

    // Intentar registro
    this.authService.registerobj(this.nombreobj, this.descobj).subscribe({
      next: async (response) => {
        if (response.success) {
          await this.presentToast('Registro exitoso', 'bottom', 3000, 'success');
        } else {
          await this.presentToast('FALLO', 'bottom', 3000, 'danger');
        }
      }
    });
  }


}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login', // Cambia 'home' por 'login'
    pathMatch: 'full'
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: 'sing-up',
    loadChildren: () => import('./pages/sing-up/sing-up.module').then(m => m.SingUpPageModule)
  },
  {
    path: 'home-profesor',
    loadChildren: () => import('./pages/home-profesor/home-profesor.module').then( m => m.HomeProfesorPageModule)
  },
  {
    path: 'home-alumno',
    loadChildren: () => import('./pages/home-alumno/home-alumno.module').then( m => m.HomeAlumnoPageModule)
  },
  {
    path: 'home-emp',
    loadChildren: () => import('./pages/home-emp/home-emp.module').then( m => m.HomeEmpPageModule)
  },
  {
    path: 'creaemp',
    loadChildren: () => import('./pages/creaemp/creaemp.module').then( m => m.CreaempPageModule)
  },
  {
    path: 'creaobj',
    loadChildren: () => import('./pages/creaobj/creaobj.module').then( m => m.CreaobjPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

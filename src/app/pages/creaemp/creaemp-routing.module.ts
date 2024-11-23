import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreaempPage } from './creaemp.page';

const routes: Routes = [
  {
    path: '',
    component: CreaempPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreaempPageRoutingModule {}

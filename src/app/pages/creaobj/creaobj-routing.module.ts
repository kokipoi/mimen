import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreaobjPage } from './creaobj.page';

const routes: Routes = [
  {
    path: '',
    component: CreaobjPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreaobjPageRoutingModule {}

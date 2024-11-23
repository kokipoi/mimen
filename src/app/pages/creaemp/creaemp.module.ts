import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreaempPageRoutingModule } from './creaemp-routing.module';

import { CreaempPage } from './creaemp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreaempPageRoutingModule
  ],
  declarations: [CreaempPage]
})
export class CreaempPageModule {}

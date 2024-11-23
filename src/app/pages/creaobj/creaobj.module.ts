import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreaobjPageRoutingModule } from './creaobj-routing.module';

import { CreaobjPage } from './creaobj.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreaobjPageRoutingModule
  ],
  declarations: [CreaobjPage]
})
export class CreaobjPageModule {}

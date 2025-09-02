import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemGroupComponent } from './item-group.component';
import { MaterialModule } from 'src/app/material';
import { ColorBarModule } from '../color-bar/color-bar.component';

@NgModule({
  declarations: [
    ItemGroupComponent
  ],
  exports: [
    ItemGroupComponent
  ],
  imports: [
    CommonModule,
    ColorBarModule,
    MaterialModule
  ]
})
export class ItemGroupModule {}

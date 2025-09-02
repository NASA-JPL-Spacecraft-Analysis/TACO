import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegendComponent } from './legend.component';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    LegendComponent
  ],
  exports: [
    LegendComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class LegendModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VizComponent } from './viz.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { LegendModule } from '../../components/legend/legend.module';
import { ItemGroupModule, DescriptionDialogModule } from '../../components';
import { CustomPipesModule } from '../../pipes/customPipes.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    VizComponent
  ],
  exports: [
    VizComponent
  ],
  imports: [
    CommonModule,
    AppHeaderModule,
    ItemGroupModule,
    LegendModule,
    ItemGroupModule,
    RouterModule,
    CustomPipesModule,
    MaterialModule,
    DescriptionDialogModule
  ]
})
export class VizModule {}

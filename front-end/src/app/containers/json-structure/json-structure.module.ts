import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { JsonStructureComponent } from './json-structure.component';
import { ItemGroupModule, LegendModule } from '../../components';
import { AppHeaderModule } from '../app-header/app-header.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    JsonStructureComponent
  ],
  exports: [
    JsonStructureComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    AppHeaderModule,
    ItemGroupModule,
    LegendModule
  ]
})
export class JsonStructureModule {}

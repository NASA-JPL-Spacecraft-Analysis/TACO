import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ItemDetailComponent } from './item-detail.component';
import { HistoryTableModule, ItemFormModule } from '../../components';
import { AppHeaderModule } from '../app-header/app-header.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    ItemDetailComponent
  ],
  exports: [
    ItemDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppHeaderModule,
    HistoryTableModule,
    ItemFormModule,
    RouterModule
  ]
})
export class ItemDetailModule {}

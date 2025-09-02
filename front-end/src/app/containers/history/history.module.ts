import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryComponent } from './history.component';
import { HistoryTableModule, DateTimePickerModule } from '../../components';
import { AppHeaderModule } from '../app-header/app-header.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    HistoryComponent
  ],
  imports: [
    CommonModule,
    AppHeaderModule,
    DateTimePickerModule,
    HistoryTableModule,
    MaterialModule
  ]
})
export class HistoryModule {}

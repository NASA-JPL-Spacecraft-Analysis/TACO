import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryTableComponent } from './history-table.component';
import { CustomPipesModule } from '../../pipes/customPipes.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    HistoryTableComponent
  ],
  exports: [
    HistoryTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CustomPipesModule
  ]
})
export class HistoryTableModule {}

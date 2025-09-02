import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemChangesDialogComponent } from './item-changes-dialog.component';
import { CustomPipesModule } from '../../pipes/customPipes.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    ItemChangesDialogComponent
  ],
  exports: [
    ItemChangesDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CustomPipesModule
  ]
})
export class ItemChangesDialogModule {}

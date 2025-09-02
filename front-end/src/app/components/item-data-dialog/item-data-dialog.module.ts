
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ItemDataDialogComponent } from './item-data-dialog.component';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    ItemDataDialogComponent
  ],
  exports: [
    ItemDataDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ItemDataDialogModule {}

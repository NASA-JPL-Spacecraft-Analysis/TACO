import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ItemFormDialogComponent } from './item-form-dialog.component';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    ItemFormDialogComponent
  ],
  exports: [
    ItemFormDialogComponent
  ],
  imports: [
    FileUploadModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ItemFormDialogModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './file-upload.component';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    FileUploadComponent
  ],
  exports: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class FileUploadModule {}

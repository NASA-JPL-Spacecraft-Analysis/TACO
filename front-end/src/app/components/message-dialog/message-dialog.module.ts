import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageDialogComponent } from './message-dialog.component';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    MessageDialogComponent
  ],
  exports: [
    MessageDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class MessageDialogModule {}

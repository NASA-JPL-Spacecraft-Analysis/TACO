import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ItemFormComponent } from './item-form.component';
import { ItemFormDialogModule } from '../item-form-dialog/item-form-dialog.module';
import { MaterialModule } from 'src/app/material';


@NgModule({
  declarations: [
    ItemFormComponent
  ],
  exports: [
    ItemFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ItemFormDialogModule
  ]
})
export class ItemFormModule {}

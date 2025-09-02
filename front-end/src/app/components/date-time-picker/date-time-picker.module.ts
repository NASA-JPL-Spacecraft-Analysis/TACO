import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { DateTimePickerComponent } from './date-time-picker.component';
import { MaterialModule } from 'src/app/material';


@NgModule({
  declarations: [
    DateTimePickerComponent
  ],
  exports: [
    DateTimePickerComponent,
  ],
  providers: [
    MaterialModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NgxMaterialTimepickerModule
  ]
})
export class DateTimePickerModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqComponent } from './faq.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    FaqComponent
  ],
  exports: [
    FaqComponent
  ],
  imports: [
    CommonModule,
    AppHeaderModule,
    MaterialModule
  ]
})
export class FaqModule {}

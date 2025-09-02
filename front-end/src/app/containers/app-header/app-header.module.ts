import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppHeaderComponent } from './app-header.component';
import { MaterialModule } from 'src/app/material';

@NgModule({
  declarations: [
    AppHeaderComponent
  ],
  exports: [
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ]
})
export class AppHeaderModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material';
import { ManagementComponent } from './management.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { ManagementConfigurationModule, ManagementItemChangesModule, ManagementStatusTableModule, ConfirmationDialogModule, ManagementHistoryTableModule } from '../../components';

@NgModule({
  declarations: [
    ManagementComponent
  ],
  exports: [
    ManagementComponent
  ],
  imports: [
    ConfirmationDialogModule,
    ManagementConfigurationModule,
    ManagementHistoryTableModule,
    ManagementItemChangesModule,
    ManagementStatusTableModule,
    CommonModule,
    FormsModule,
    AppHeaderModule,
    MaterialModule,
    RouterModule
  ]
})
export class ManagementModule {}

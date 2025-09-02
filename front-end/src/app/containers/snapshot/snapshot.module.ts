import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ColorBarModule, DateTimePickerModule, ItemGroupModule, LegendModule } from '../../components';
import { SnapshotComponent } from './snapshot.component';
import { ItemChangesDialogModule } from '../../components';
import { ItemChangesDialogComponent } from '../../components/item-changes-dialog/item-changes-dialog.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { MaterialModule } from 'src/app/material';

@NgModule({
  entryComponents: [
    ItemChangesDialogComponent
  ],
  declarations: [
    SnapshotComponent
  ],
  exports: [
    SnapshotComponent
  ],
  imports: [
    CommonModule,
    ColorBarModule,
    MaterialModule,
    LegendModule,
    ItemGroupModule,
    DateTimePickerModule,
    AppHeaderModule,
    MaterialModule,
    ItemChangesDialogModule,
    RouterModule
  ]
})
export class SnapshotModule {}

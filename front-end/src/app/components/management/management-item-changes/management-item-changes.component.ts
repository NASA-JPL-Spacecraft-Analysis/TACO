import { Component, ChangeDetectionStrategy, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryTableModule } from '../../history-table/history-table.module';
import { EntryAction, ItemChanges, ItemData, ItemStatus, NumberTMap } from 'src/app/models';
import { MaterialModule } from 'src/app/material';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'management-item-changes',
  templateUrl: 'management-item-changes.component.html',
  styleUrls: ['management-item-changes.component.css']
})
export class ManagementItemChangesComponent {
  @Input() public hoveredImage: Blob;
  @Input() public items: ItemData[];
  @Input() public itemChanges: ItemChanges[];
  @Input() public itemStatuses: NumberTMap<ItemStatus>;

  @Output() public editOutput: EventEmitter<EntryAction>;
  @Output() public showImageOutput: EventEmitter<number>;

  constructor() {
    this.editOutput = new EventEmitter<EntryAction>();
    this.showImageOutput = new EventEmitter<number>();
  }

  public handleEntryAction(editAction: EntryAction): void {
    this.editOutput.emit(editAction);
  }

  public toggleShowImage(itemChangesId: number): void {
    this.showImageOutput.emit(itemChangesId);
  }
}

@NgModule({
  declarations: [
    ManagementItemChangesComponent
  ],
  exports: [
    ManagementItemChangesComponent
  ],
  imports: [
    CommonModule,
    HistoryTableModule,
    MaterialModule
  ]
})
export class ManagementItemChangesModule { }

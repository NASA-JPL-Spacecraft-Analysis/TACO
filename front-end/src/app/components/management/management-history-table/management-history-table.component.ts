import { Component, ChangeDetectionStrategy, NgModule, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material';
import { ItemDataHistory, ItemStatus, NumberTMap } from 'src/app/models';
import { StateTrackerConstants } from 'src/app/consts/StateTrackerConstants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'management-history-table',
  styleUrls: [ 'management-history-table.component.css' ],
  templateUrl: 'management-history-table.component.html'
})
export class ManagementHistoryTableComponent implements OnChanges {
  @Input() public historyList: ItemDataHistory[];
  @Input() public itemStatuses: NumberTMap<ItemStatus>;
  @Input() public title: string;
  
  public columnsToDisplay: string[] = [];
  public readonly excludedColumns: Set<string>;

  constructor() {
    this.excludedColumns = new Set();

    this.excludedColumns.add('children');
    this.excludedColumns.add('itemDataId');
    this.excludedColumns.add('latestChange');
    this.excludedColumns.add('itemId');
    this.excludedColumns.add('latestChange');
    this.excludedColumns.add('parentId');
    this.excludedColumns.add('testbedId');
  }

  public ngOnChanges(): void {
    if (this.historyList.length > 0) {
      this.columnsToDisplay = Object.getOwnPropertyNames(this.historyList[0]);
    }

    this.columnsToDisplay = this.columnsToDisplay.filter((column) => {
      return !this.excludedColumns.has(column);
    });
  }

  public getStatus(statusId: string): string {
    if (this.itemStatuses && this.itemStatuses[statusId]) {
      return this.itemStatuses[statusId].status;
    }

    // If the item doesn't have a status, then it is Not Present/Absent.
    return StateTrackerConstants.NOT_PRESENT_TEXT;
  }
}

@NgModule({
  declarations: [
    ManagementHistoryTableComponent
  ],
  exports: [
    ManagementHistoryTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ManagementHistoryTableModule {}

import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Comparison, ItemStatus, NumberTMap } from 'src/app/models';
import { StateTrackerConstants } from 'src/app/consts/StateTrackerConstants';
import { MaterialModule } from 'src/app/material';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'comparison-table',
  styleUrls: [ 'comparison-table.component.css' ],
  templateUrl: 'comparison-table.component.html'
})
export class ComparisonTableComponent {
  @Input() public comparisonList: Comparison[];
  @Input() public itemStatuses: NumberTMap<ItemStatus>;

  public columnsToDisplay = [
    'itemName',
    'field',
    'newValue',
    'oldValue',
    'updated'
  ];

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
    ComparisonTableComponent
  ],
  exports: [
    ComparisonTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ComparisonTableModule {}

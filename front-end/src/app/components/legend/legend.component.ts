import { Component, Input, OnChanges } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

import { NumberTMap, ItemStatus} from '../../models';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'legend',
  templateUrl: 'legend.component.html',
  styleUrls: [ 'legend.component.css' ]
})
export class LegendComponent implements OnChanges {
  @Input() public itemStatuses: NumberTMap<ItemStatus>;

  public itemStatusList: ItemStatus[];

  public ngOnChanges(): void {
    this.itemStatusList = [];
    const keys = Object.keys(this.itemStatuses);
    let isUploadedTestbed = false;

    if (keys.length > 0) {
      for (const key of keys) {
        if (this.itemStatuses[key].id === undefined) {
          isUploadedTestbed = true;
        }

        // For all uploaded testbeds.
        if (Number(key) !== StateTrackerConstants.NOT_PRESENT_STATUS_ID) {
          this.itemStatusList.push(this.itemStatuses[key]);
        }
      }

      this.itemStatusList = this.itemStatusList.sort((a, b) => a.sortOrder - b.sortOrder);

      if (!isUploadedTestbed) {
        // Add the Not Present / Absent as the last item in the legend.
        this.itemStatusList.push(this.itemStatuses[String(StateTrackerConstants.NOT_PRESENT_STATUS_ID)]);
      }
    }
  }
}

import { Component, Input, ChangeDetectionStrategy, OnChanges, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemData, ItemStatus, NumberTMap } from 'src/app/models';
import { MaterialModule } from 'src/app/material';

interface ColorBarItem {
  color: string;
  count: number;
  sortOrder: number;
  status: string;
  statusId: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'color-bar',
  styleUrls: [ 'color-bar.component.css' ],
  templateUrl: 'color-bar.component.html'
})
export class ColorBarComponent implements OnChanges {
  @Input() public item: ItemData;
  @Input() public itemStatuses: NumberTMap<ItemStatus>;
  @Input() public itemStatusMap: Map<number, string[]>;

  public totalStatuses: number;
  public colorBarList: ColorBarItem[];

  public ngOnChanges(): void {
    this.totalStatuses = 0;
    this.colorBarList = [];

    if (this.itemStatusMap) {
      this.createColorBarItems();

      this.sortColorBarItems();

      for (const key of this.itemStatusMap.keys()) {
        if (key === this.item.id) {
          for (const status of this.itemStatusMap.get(key)) {
            const currentStatus = Number(status);
            this.totalStatuses++;

            for (const colorBarItem of this.colorBarList) {
              if (colorBarItem.statusId === currentStatus) {
                colorBarItem.count++;
              }
            }
          }
        }
      }
    }
  }

  private createColorBarItems(): void {
    for (const key of Object.keys(this.itemStatuses)) {
      // Create a colorBarItem for each existing status.
      const colorBarItem: ColorBarItem = {
        color: this.itemStatuses[key].color,
        count: 0,
        status: this.itemStatuses[key].status,
        sortOrder: this.itemStatuses[key].sortOrder,
        statusId: this.itemStatuses[key].id
      }

      this.colorBarList.push(colorBarItem);
    }
  }

  private sortColorBarItems(): void {
    this.colorBarList = this.colorBarList.sort((a, b) => {
      if (a.sortOrder === b.sortOrder) {
        return 0;
      } else if (a.sortOrder === null) {
        return 1;
      } else if (b.sortOrder === null) {
        return -1;
      }

      return a.sortOrder - b.sortOrder;
    });
  }
}

@NgModule({
  declarations: [
    ColorBarComponent
  ],
  exports: [
    ColorBarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ColorBarModule {}

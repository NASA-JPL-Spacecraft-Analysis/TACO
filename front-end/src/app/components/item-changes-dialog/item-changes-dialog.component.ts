import { Component, ChangeDetectionStrategy, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ItemData, NumberTMap, ItemStatus, ItemChangesDialogData } from '../../models';
import { StateTrackerConstants } from 'src/app/consts/StateTrackerConstants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'item-changes-dialog',
  templateUrl: 'item-changes-dialog.component.html',
  styleUrls: [ 'item-changes-dialog.component.css' ]
})
export class ItemChangesDialogComponent implements OnInit {
  public itemStatuses: NumberTMap<ItemStatus>;
  public itemData: ItemData;

  constructor(
    public dialogRef: MatDialogRef<ItemChangesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemChangesDialogData
  ) {}

  public ngOnInit(): void {
    this.itemData = this.data.itemData;
    this.itemStatuses = this.data.itemStatuses;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public getItemStatus(): string {
    if (this.itemData.latestChange.status) {
      return this.itemStatuses[this.itemData.latestChange.status].status;
    }

    return StateTrackerConstants.NOT_PRESENT_TEXT;
  }
}

import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { ItemData, ItemChanges, NumberTMap, ItemStatus } from '../../models';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';

import * as moment from 'moment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'item-group',
  templateUrl: 'item-group.component.html',
  styleUrls: [ 'item-group.component.css' ]
})
export class ItemGroupComponent {
  @Input() public collapsedItems: Set<number>;
  @Input() public item: ItemData;
  @Input() public itemStatusMap: Map<number, string[]>;
  @Input() public itemStatuses: NumberTMap<ItemStatus>;
  @Input() public presentationMode: boolean;
  @Input() public recentlyChangedDays: number;
  @Input() public showOnlineToggleButton: boolean;

  @Output() public selectItem: EventEmitter<ItemData> = new EventEmitter<ItemData>();
  @Output() public onlineToggle: EventEmitter<ItemData> = new EventEmitter<ItemData>();

  public collapse: boolean;
  public notPresentStatusId = String(StateTrackerConstants.NOT_PRESENT_STATUS_ID);

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon('online', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/online.svg'));
    this.iconRegistry.addSvgIcon('offline', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/offline.svg'));
  }

  public checkRecentChange(item: ItemData): boolean {
    if (this.recentlyChangedDays) {
      return moment(new Date()).diff(item.latestChange.updated, 'days')
        <= this.recentlyChangedDays;
    }

    return false;
  }

  public onChildSelectItem(item: ItemData): void {
    this.selectItem.emit(item);
  }

  public onOnlineToggle(item: ItemData): void {
    this.onlineToggle.emit(item);
  }

  public formatTooltipData(data: ItemChanges): string {
    let result = '';

    if (data) {
      const { serialNumber, version, partNumber, description } = data;

      if (description) {
        const firstLineIndex = description.indexOf('\n');
        // include newline at the end no matter what
        let substr = firstLineIndex === -1 ? description + '\n' : description.substring(0, firstLineIndex + 1);

        if (substr.length > StateTrackerConstants.TOOLTIP_DESCRIPTION_MAX_LENGTH) {
          substr = substr.substring(0, StateTrackerConstants.TOOLTIP_DESCRIPTION_MAX_LENGTH) + '...\n';
        }

        result += substr;
      }

      if (version) {
        result += `Version: ${version}\n`;
      }

      if (serialNumber) {
        result += `Serial Number: ${serialNumber}\n`;
      }

      if (partNumber) {
        result += `Part Number: ${partNumber}\n`;
      }
    }

    return result;
  }

  public toggleCollapsedItem(id: number): void {
    if (this.collapsedItems.has(id)) {
      this.collapsedItems.delete(id);
    } else {
      this.collapsedItems.add(id);
    }
  }
}

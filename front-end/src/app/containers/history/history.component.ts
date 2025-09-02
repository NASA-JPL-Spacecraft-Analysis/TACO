import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { SubSink } from 'subsink';

import * as moment from 'moment';

import { ItemData, ItemChanges, DateFilter, Testbed, NumberTMap, ItemStatus, ItemDataMap } from '../../models';
import { getItemStatuses, getHistory, getTestbeds, getHoveredImage, getItemDataMap } from '../../selectors';
import { OutputActions, ItemActions } from '../../actions';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';
import { AppState } from '../../app-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'history',
  templateUrl: 'history.component.html',
  styleUrls: [ 'history.component.css' ]
})
export class HistoryComponent implements OnDestroy {
  public history: ItemChanges[];
  public filteredHistory: ItemChanges[];
  public minDate: Date;
  public itemDataMap: ItemDataMap;
  public itemStatuses: NumberTMap<ItemStatus>;
  public testbeds: NumberTMap<Testbed>;
  public hoveredImage: Blob;

  private subscriptions = new SubSink();

  constructor(
    private store: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.subscriptions.add(
      this.store.pipe(select(getItemStatuses)).subscribe(itemStatuses => {
        this.itemStatuses = itemStatuses;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemDataMap)).subscribe(itemDataMap => {
        this.itemDataMap = itemDataMap;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getHoveredImage)).subscribe(hoveredImage => {
        this.hoveredImage = hoveredImage;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbeds)).subscribe(testbeds => {
        this.testbeds = testbeds;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getHistory)).subscribe(history => {
        this.history = history;
        this.filteredHistory = [
          ...history
        ];

        // Get the min date from our history (last item).
        if (history && history.length > 0) {
          this.minDate = moment(history[history.length - 1].updated).toDate();
        } else {
          this.minDate = new Date();
        }

        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Filter our history based on the start and end date the user selects.
   *
   * @param startDate
   * @param endDate
   */
  public onFilter(dateFilter: DateFilter): void {
    // startDate will be undefined if we cleared the filter.
    if (dateFilter.startDate !== undefined) {
      this.filteredHistory = this.history.filter(
        (itemChanges: ItemChanges) => {
          if (dateFilter.endDate) {
            return moment.utc(itemChanges.updated, StateTrackerConstants.MOMENT_DATE_FORMAT)
              .isBetween(dateFilter.startDate, dateFilter.endDate);
          }

          return moment.utc(itemChanges.updated, StateTrackerConstants.MOMENT_DATE_FORMAT).isAfter(dateFilter.startDate);
        }
      );
    } else {
      this.filteredHistory = this.history;
    }
  }

  public export(): void {
    this.store.dispatch(OutputActions.CreateHistoryOutput({
      history: this.filteredHistory,
      itemData: this.itemDataMap,
      statuses: this.itemStatuses
    }));
  }

  public toggleShowImage(itemChangesId: number): void {
    this.store.dispatch(ItemActions.toggleImage({
      itemChangesId
    }));
  }
}

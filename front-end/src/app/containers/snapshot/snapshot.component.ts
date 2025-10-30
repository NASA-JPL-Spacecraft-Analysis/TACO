import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import * as moment from 'moment';

import { ItemData, DateFilter, ItemChanges, Testbed, NumberTMap, ItemStatus } from '../../models';
import { getHistory, getItemsAsTree, getTestbeds, getItemStatuses } from '../../selectors';
import { OutputActions } from '../../actions';
import { ItemChangesDialogComponent } from '../../components/item-changes-dialog/item-changes-dialog.component';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';
import { AppState } from '../../app-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'snapshot',
  templateUrl: 'snapshot.component.html',
  styleUrls: ['snapshot.component.css']
})
export class SnapshotComponent implements OnDestroy, OnInit {
  public collapsedItems: Set<number>;
  public currentTestbed: Testbed;
  public filteredItemData: ItemData[];
  public itemStatuses: NumberTMap<ItemStatus>;
  public itemStatusMap: Map<number, string[]>;
  public testbeds: NumberTMap<Testbed>;
  public minDate: Date;
  public filterDate: string;
  public filterTime: string;

  private newHistory: ItemChanges[];
  private filteredHistory: Map<number, ItemChanges>;
  private newItemData: ItemData[];
  private subscriptions = new SubSink();
  private dateFilter: DateFilter;

  constructor(
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.collapsedItems = new Set();

    this.subscriptions.add(
      this.store.pipe(select(getHistory)).subscribe(history => {
        this.newHistory = history;

        if (history && history.length > 0) {
          this.minDate = moment(history[history.length - 1].updated).toDate();
        }

        // After our history loads, try and filter it if we have filter query params.
        if (this.dateFilter) {
          this.onFilter(this.dateFilter);
        }

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemsAsTree)).subscribe(itemData => {
        this.newItemData = itemData;
        this.filteredItemData = itemData;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemStatuses)).subscribe(itemStatuses => {
        this.itemStatuses = itemStatuses;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbeds)).subscribe(testbeds => {
        const { testbedId } = this.route.snapshot.paramMap['params'];
        this.currentTestbed = testbeds[testbedId];
        this.testbeds = testbeds;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  /**
   * On component init, pull the query parameters if they exist, and pass them to the
   * date / time filter.
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe(
      (queryParams => {
        const momentFilter = moment(queryParams.filter).utc();

        if (queryParams.filter && momentFilter.isValid()) {
          this.filterDate = momentFilter.format(StateTrackerConstants.MOMENT_DATE_PARSE_FORMAT);
          this.filterTime = momentFilter.format(StateTrackerConstants.MOMENT_TIME_FORMAT);

          this.dateFilter = { endDate: momentFilter };
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onFilter(filter: DateFilter): void {
    this.updateQueryParams(filter.endDate);

    this.filteredHistory = new Map();

    // Look through our history, and pick out all the changes that are before the filter end.
    for (const historyItem of this.newHistory) {
      const createdDateTime = moment.utc(historyItem.updated, StateTrackerConstants.MOMENT_DATE_FORMAT);

      // Only add the history to our list if it's before the snapshot date / time.
      if (createdDateTime.isBefore(filter.endDate)) {
        const currentHistoryItem = this.filteredHistory.get(historyItem.itemId);

        /**
         * If we don't have a current history item, add the history to our list.
         * If we do have a current history item, make sure we're adding the item closest to the filter.
         */
        if (currentHistoryItem === undefined
          || currentHistoryItem && moment(currentHistoryItem.updated).isBefore(historyItem.updated)) {
          this.filteredHistory.set(historyItem.itemId, historyItem);
        }
      }
    }

    this.filteredItemData = this.newItemData.map(this.updateItemHistory, this);
  }

  /**
   * Open the ItemChangesDialog in view mode when an item is clicked.
   * @param item The clicked item.
   */
  public onItemSelect(item: ItemData): void {
    this.dialog.open(ItemChangesDialogComponent, {
      width: '50em',
      maxHeight: '50em',
      data: { itemData: item, itemStatuses: this.itemStatuses },
      autoFocus: false
    });
  }

  public exportJSONSnapshot(): void {
    this.store.dispatch(OutputActions.CreateSnapshotJSONOutput({
      testbed: this.currentTestbed,
      latest: this.filteredItemData,
      itemStatuses: this.itemStatuses
    }));
  }

  public exportCSVSnapshot(): void {
    this.store.dispatch(OutputActions.CreateSnapshotCSVOutput({
      testbed: this.currentTestbed,
      latest: this.filteredItemData,
      itemStatuses: this.itemStatuses
    }));
  }

  /**
   * Called when the filter changes. Loop over every item and set the most recent change to conform with the filter.
   * @param itemData
   */
  private updateItemHistory(itemData: ItemData): ItemData {
    const updatedChildren = itemData.children ? itemData.children.map(this.updateItemHistory, this) : null;

    itemData.children = updatedChildren;

    const historyForItem = this.filteredHistory.get(itemData.id);

    if (historyForItem !== null) {
      // If we come across a history for an item that is inside our filtered range, set it to the correct item.
      itemData.latestChange = historyForItem;
    } else {
      // If we don't have a history for an item, then set the latestChange to null to reflect that.
      itemData.latestChange = null;
    }

    return {
      ...itemData
    };
  }

  /**
   * Called when our date / time filter changes. Update the current URL with the filter date and time
   * so users can link directly to a filtered snapshot.
   * @param endDate The date that we want to be our query parameter.
   */
  private updateQueryParams(endDate: moment.Moment): void {
    this.router.navigate([], {
      relativeTo: this.route.parent,
      queryParams: {
        filter: moment(endDate).toISOString()
      },
      queryParamsHandling: 'merge'
    });
  }
}

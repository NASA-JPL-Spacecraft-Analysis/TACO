import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { getItemStatuses, getTestbeds, getUsername, getTestbedSettings, getUserCanEdit, getItemsAsTree, getItemStatusMap } from '../../selectors';
import { ItemData, Testbed, NumberTMap, ItemStatus, TestbedSettings } from '../../models';
import { ItemActions, TestbedActions } from '../../actions';
import { AppState } from '../../app-store';
import { DescriptionDialogComponent } from 'src/app/components';
import { StateTrackerConstants } from 'src/app/consts/StateTrackerConstants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'viz-app',
  styleUrls: [ './viz.component.css' ],
  templateUrl: './viz.component.html'
})
export class VizComponent implements OnDestroy {
  public collapsedItems: Set<number>;
  public currentRecentlyChangedValue: number;
  public currentTestbed: Testbed;
  public itemDataList: ItemData[];
  public itemStatuses: NumberTMap<ItemStatus>;
  public itemStatusMap: Map<number, string[]>;
  public presentationMode: boolean;
  public recentlyChangedDays: number;
  public testbeds: NumberTMap<Testbed>;
  public testbedSettings: TestbedSettings;
  public userCanEdit: boolean;

  private interval: number;
  private openDialog: MatDialogRef<DescriptionDialogComponent>;
  private subscriptions = new SubSink();
  private username: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.collapsedItems = new Set();

    this.subscriptions.add(
      this.store.pipe(select(getUserCanEdit)).subscribe(userCanEdit => {
        this.userCanEdit = userCanEdit;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemsAsTree)).subscribe(itemDataList => {
        this.itemDataList = itemDataList;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemStatusMap)).subscribe(itemStatusMap => {
        this.itemStatusMap = itemStatusMap;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemStatuses)).subscribe(itemStatuses => {
        this.itemStatuses = itemStatuses;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbeds)).subscribe(testbeds => {
        const testbedId = Number(this.route.snapshot.paramMap.get('testbedId'));
        this.testbeds = testbeds;

        this.currentTestbed = this.testbeds[testbedId];

        // Update the open dialog's testbed to update the saved description.
        if (this.openDialog) {
          this.openDialog.componentInstance.data = this.currentTestbed;
        }

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbedSettings)).subscribe(testbedSettings => {
        const testbedId = Number(this.route.snapshot.paramMap.get('testbedId'));
        this.clearInterval();

        for (const testbedSetting of testbedSettings) {
          if (testbedSetting.testbedId === testbedId) {
            this.testbedSettings = testbedSetting;
          }
        }

        if (this.testbedSettings) {
          // Only enable our interval if auto refresh is on, has an interval, and we don't have an interval running already.
          if (this.testbedSettings.autoRefreshEnabled && this.testbedSettings.autoRefreshInterval && !this.interval) {
            this.interval = window.setInterval(() => {
              this.store.dispatch(ItemActions.getItemData({
                testbedId
              }));
              // Interval is in seconds so we need to multiply by 1000.
            }, this.testbedSettings.autoRefreshInterval * 1000);
          }

          if (this.testbedSettings.recentlyChangedIndicatorEnabled) {
            this.currentRecentlyChangedValue =
              this.testbedSettings.recentlyChangedIndicatorDays ?
              this.testbedSettings.recentlyChangedIndicatorDays : StateTrackerConstants.DEFAULT_RECENTLY_CHANGED_DAYS;
          } else {
            this.currentRecentlyChangedValue = 0;
          }

          // Set the value, this'll change later if the user drags the slider.
          this.recentlyChangedDays = this.currentRecentlyChangedValue;
        }

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getUsername)).subscribe(username => {
        this.username = username;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.clearInterval();
  }

  public onDescriptionClick(): void {
    this.openDialog = this.dialog.open(DescriptionDialogComponent, {
      width: '50em',
      data: this.currentTestbed,
      disableClose: true
    });

    this.subscriptions.add(
      this.openDialog.componentInstance.saveOutput.subscribe((description: string) => {
        this.store.dispatch(TestbedActions.saveTestbedDescription({
          description,
          testbedId: this.currentTestbed.id
        }));
      })
    );
  }

  public onPresentationClick(): void {
    this.presentationMode = !this.presentationMode;
  }

  public onSliderChange(value: number) {
    this.recentlyChangedDays = value;
  }

  public onSelectItem(item: ItemData): void {
    this.router.navigate([ './item/' + item.id ], { relativeTo: this.route });
  }

  public onOnlineToggle(item: ItemData): void {
    this.store.dispatch(ItemActions.toggleOnline({
      item,
      username: this.username
    }));
  }

  private clearInterval(): void {
    clearInterval(this.interval);
    this.interval = null;
  }
}

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgModule, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import * as moment from 'moment';

import { Comparison, DateFilter, ItemStatus, NumberTMap, Testbed } from 'src/app/models';
import { DateTimePickerModule } from '../../components/date-time-picker/date-time-picker.module';
import { getComparisonList, getHistory, getItemStatuses, getTestbeds } from 'src/app/selectors';
import { AppState } from 'src/app/app-store';
import { SnapshotActions } from '../../actions';
import { AppHeaderModule } from '../app-header/app-header.module';
import { ComparisonTableModule } from '../../components/comparison-table/comparison-table.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'snapshot-comparison',
  styleUrls: [ 'snapshot-comparison.component.css' ],
  templateUrl: 'snapshot-comparison.component.html'
})
export class SnapshotComparisonComponent implements OnDestroy {
  public comparisonList: Comparison[];
  public filterDate: string;
  public filterTime: string;
  public itemStatuses: NumberTMap<ItemStatus>;
  public minDate: Date;
  public testbeds: NumberTMap<Testbed>;

  private format = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';
  private subscriptions = new SubSink();
  private testbedId: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.testbedId = this.activatedRoute.snapshot.paramMap['params'].testbedId;

    this.subscriptions.add(
      this.store.pipe(select(getComparisonList)).subscribe(comparisonList => {
        this.comparisonList = comparisonList;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getHistory)).subscribe(history => {
        if (history && history.length > 0) {
          this.minDate = moment(history[history.length - 1].updated).toDate();
        }

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemStatuses)).subscribe(itemStatuses => {
        this.itemStatuses = itemStatuses;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbeds)).subscribe(testbeds => {
        this.testbeds = testbeds;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onFilter(filter: DateFilter): void {
    if (filter.startDate && filter.endDate) {
      // If the start and end are the same day, make sure the start is before the end.
      if (filter.endDate.isSame(filter.endDate, 'day') && filter.endDate.isBefore(filter.startDate)) {
        this.comparisonList = [];
      } else {
        this.store.dispatch(SnapshotActions.fetchComparison({
          startDateTime: filter.startDate.format(this.format),
          endDateTime: filter.endDate.format(this.format),
          testbedId: this.testbedId
        }));
      }
    } else {
      // Clear out the list when the user clears the date inputs.
      this.comparisonList = [];
    }
  }
}

@NgModule({
  declarations: [
    SnapshotComparisonComponent
  ],
  exports: [
    SnapshotComparisonComponent
  ],
  imports: [
    AppHeaderModule,
    CommonModule,
    ComparisonTableModule,
    DateTimePickerModule
  ]
})
export class SnapshotComparisonModule {}

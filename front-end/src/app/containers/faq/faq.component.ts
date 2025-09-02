import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { getTestbeds } from '../../selectors';
import { Testbed, NumberTMap } from '../../models';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';
import { AppState } from '../../app-store';
import { environment } from 'src/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'faq',
  styleUrls: [ 'faq.component.css' ],
  templateUrl: 'faq.component.html'
})
export class FaqComponent implements OnDestroy {
  public testbeds: NumberTMap<Testbed>;
  public title = 'Faqs';
  public url: string;
  public editGroups = environment?.editGroups;

  public itemChangesSamplePayload = StateTrackerConstants.SAMPLE_ITEM_CHANGES_PAYLOAD;
  public sampleJsonPayload = StateTrackerConstants.SAMPLE_JSON_PAYLOAD;

  private subscriptions = new SubSink();

  constructor(
    private store: Store<AppState>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.subscriptions.add(
      this.store.pipe(select(getTestbeds)).subscribe(testbeds => {
        this.testbeds = testbeds;
        this.changeDetectorRef.markForCheck();
      })
    );

    this.url = window.location.origin + '/taco/api/v1';
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

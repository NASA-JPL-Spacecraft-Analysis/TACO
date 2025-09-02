import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { ItemData, StatusStructure, TestbedStructure, Testbed, NumberTMap } from '../../models';
import { StructureActions } from '../../actions';
import { getPreviewItemData, getStructureErrors, getPreviewStatuses, getPreviewTestbedData, getTestbeds } from '../../selectors';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';
import { AppState } from './../../app-store';

/*
FIXME: If a user loads a config.json file, changes the file, and then tries to load
  the same file again, it doesn't work. Probably some Chrome/Browser optimization
  to not try and load the same file twice if it's already loaded in memory.F

TODO: maybe a visual editor to create your testbed? Incase users
  don't know JSON
*/

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'json-structure',
  templateUrl: 'json-structure.component.html',
  styleUrls: ['json-structure.component.css']
})
export class JsonStructureComponent {
  public collapsedItems: Set<number>;
  public testbeds$: Observable<NumberTMap<Testbed>>;
  public testbedData$: Observable<TestbedStructure>;
  public data$: Observable<ItemData[]>;
  public errors$: Observable<Error>;
  public statuses$: Observable<StatusStructure[]>;

  public sampleJson = StateTrackerConstants.SAMPLE_JSON_PAYLOAD;

  constructor(
    private store: Store<AppState>
  ) {
    this.collapsedItems = new Set();

    this.testbeds$ = this.store.pipe(select(getTestbeds));
    this.testbedData$ = this.store.pipe(select(getPreviewTestbedData));
    this.data$ = this.store.pipe(select(getPreviewItemData));
    this.errors$ = this.store.pipe(select(getStructureErrors));
    this.statuses$ = this.store.pipe(select(getPreviewStatuses));
  }

  public onFileEvent(fileEvent: Event): void {
    const file = (fileEvent.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }

    this.store.dispatch(StructureActions.PreviewTestbedStructure({ file }));
  }

  public onUploadClick(evt: Event): void {
    this.store.dispatch(StructureActions.UploadTestbedStructure(null));
  }
}

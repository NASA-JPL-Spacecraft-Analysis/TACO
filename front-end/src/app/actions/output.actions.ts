import { createAction, props } from '@ngrx/store';

import { ItemChanges, Testbed, ItemData, NumberTMap, ItemStatus } from '../models';

export const CreateHistoryOutput = createAction(
  '[Output] Create History Output',
  props<{ history: ItemChanges[], itemData: NumberTMap<ItemData>, statuses: NumberTMap<ItemStatus> }>()
);

export const CreateSnapshotJSONOutput = createAction(
  '[Output] Create Snapshot JSON Output',
  props<{ testbed: Testbed, latest: ItemData[], itemStatuses: NumberTMap<ItemStatus> }>()
);

export const CreateSnapshotCSVOutput = createAction(
  '[Output] Create Snapshot CSV Output',
  props<{ testbed: Testbed, latest: ItemData[], itemStatuses: NumberTMap<ItemStatus> }>()
);

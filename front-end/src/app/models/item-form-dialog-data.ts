import { ItemChanges } from './item-changes';
import { NumberTMap } from './map';
import { ItemStatus } from './item-status';

export interface ItemFormDialogData {
  changes: ItemChanges;
  itemStatuses: NumberTMap<ItemStatus>;
  editing?: boolean;
}

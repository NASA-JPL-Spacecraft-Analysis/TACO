import { ItemData } from './item-data';
import { NumberTMap } from './map';
import { ItemStatus } from './item-status';

export interface ItemChangesDialogData {
  itemData: ItemData;
  itemStatuses: NumberTMap<ItemStatus>;
}

import { ItemChanges } from './item-changes';
import { StringTMap } from './string-t-map';

export interface ItemData {
  children: Array<ItemData>;
  description: string;
  fullname: string;
  id: number;
  latestChange: ItemChanges;
  locked: boolean;
  name: string;
  online: boolean;
  parentId: number;
  sortOrder: number;
  testbedId: number;
}

export interface ItemDataHistory extends ItemData {
  itemDataId: number;
  username: string;
}

export type ItemDataMap = StringTMap<ItemData>;
export type TestbedToItemDataMap = StringTMap<ItemDataMap>;

import { ItemData } from './item-data';
import { ItemStatus } from './item-status';

export interface Testbed {
  acronym: string;
  description: string;
  id: number;
  items: ItemData[];
  name: string;
  statuses: ItemStatus[];
  sortOrder: number;
}

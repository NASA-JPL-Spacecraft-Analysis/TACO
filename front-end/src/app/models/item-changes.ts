export interface ItemChanges {
  id: number;
  itemId: number;
  status: number | string;
  description: string;
  version: string;
  serialNumber: string;
  partNumber: string;
  username: string;
  updated: string;
  rationale: string;
  image: boolean;
}

export interface ItemChangesHistory extends ItemChanges {
  modifiedAt: string;
  modifiedBy: string;
}

export type ItemChangesExport = Omit<ItemChanges, 'id' | 'itemId'>;

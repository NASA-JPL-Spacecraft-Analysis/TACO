import { createAction, props } from '@ngrx/store';

import { ItemDataHistory, ItemStatus, ItemChanges, ItemData, TestbedSettings, ItemFormDialogData, TestbedToItemDataMap, ItemDataMap } from '../models';

export const getItemData = createAction(
  '[item] getItemData',
  props<{ testbedId: number }>()
);

export const getItemDataFailure = createAction(
  '[item] getItemDataFailure',
  props<{ error: Error }>()
);

export const CreateItemChanges = createAction(
  '[Item] Create Item Changes',
  props<{ itemId: number, itemChanges: ItemChanges, image?: File }>()
);

export const createItemData = createAction(
  '[item] createItemData',
  props<{ itemData: ItemData }>()
);

export const createItemDataFailure = createAction(
  '[item] createItemDataFailure',
  props<{ error: Error }>()
);

export const createItemDataSuccess = createAction(
  '[item] createItemDataSuccess',
  props<{ itemData: ItemData }>()
);

export const createItemStatus = createAction(
  '[item] createItemStatus',
  props<{ itemStatus: ItemStatus }>()
);

export const createItemStatusFailure = createAction(
  '[item] createItemStatusFailure',
  props<{ error: Error }>()
);

export const createItemStatusSuccess = createAction(
  '[item] createItemStatusSuccess',
  props<{ itemStatus: ItemStatus }>()
);

export const deleteItem = createAction(
  '[item] deleteItem',
  props<{ itemData: ItemData }>()
);

export const deleteItemFailure = createAction(
  '[item] deleteItemFailure',
  props<{ error: Error }>()
);

export const deleteItemSuccess = createAction(
  '[item] deleteItemSuccess',
  props<{ itemId: number }>()
);

export const DeleteItemChanges = createAction(
  '[Item] Delete Item Changes',
  props<{ id: number }>()
);

export const DeleteItemChangesSuccess = createAction(
  '[Item] Delete Item Change Success',
  props<{ deleted: boolean, id: number }>()
);

export const DeleteItemChangesFailure = createAction(
  '[Item] Delete Item Change Failure',
  props<{ error: Error }>()
);

export const ItemChangesModifyFailure = createAction(
  '[Item] Create Item Changes Failure',
  props<{ error: Error }>()
);

export const ItemChangesModifySuccess = createAction(
  '[Item] Create Item Changes Success',
  props<{ itemChanges: ItemChanges }>()
);

export const fetchHistoryFailure = createAction(
  '[item] fetchHistoryFailure',
  props<{ error: Error }>()
);

export const fetchItemChangesFailure = createAction(
  '[item] fetchItemChangesFailure',
  props<{ error: Error }>()
);

export const fetchItemChangesHistoryFailure = createAction(
  '[item] fetchItemChangesHistoryFailure',
  props<{ error: Error }>()
);

export const fetchItemDataHistoryFailure = createAction(
  '[item] fetchItemDataHistoryFailure',
  props<{ error: Error }>()
);

export const fetchItemDataMapFailure = createAction(
  '[item] fetchItemDataMapFailure',
  props<{ error: Error }>()
);

export const FetchItemsFailure = createAction(
  '[Item] Fetch Items Failure',
  props<{ error: Error }>()
);

export const FetchItemStatusesFailure = createAction(
  '[Item] Fetch Item Statuses Failure',
  props<{ error: Error }>()
);

export const fetchSnapshot = createAction(
  '[item] fetchSnapshot',
  props<{ dateTime?: string, testbedId: number }>()
);

export const fetchSnapshotFailure = createAction(
  '[item] fetchSnapshot',
  props<{ error: Error }>()
);

export const fetchSnapshotSuccess = createAction(
  '[item] fetchSnapshot',
  props<{ snapshot: ItemData[] }>()
);

export const FetchTestbedSettingsFailure = createAction(
  '[Item] Fetch Testbed Setitngs Failure',
  props<{ error: Error }>()
);

export const getImage = createAction(
  '[Item] getImage',
  props<{ itemChangesId: number }>()
);

export const getImageFailure = createAction(
  '[Item] getImageFailure',
  props<{ error: Error }>()
);

export const getImageSuccess = createAction(
  '[Item] getImageSuccess',
  props<{ image: Blob, itemChangesId: number }>()
);

export const openItemFormDialog = createAction(
  '[Item] openItemFormDialog',
  props<{ selectedItemId: number, dialogData: ItemFormDialogData, editing?: boolean }>()
);

export const SaveImage = createAction(
  '[Item] Save Image',
  props<{ itemChangeId: number, image: File }>()
);

export const SaveImageFailure = createAction(
  '[Item] Save Image Failure',
  props<{ error: Error }>()
);

export const saveImageSuccess = createAction(
  '[item] saveImageSuccess',
  props<{ success: boolean }>()
);

export const saveItemDescription = createAction(
  '[item] saveItemDescription',
  props<{ description: string, itemId: number }>()
);

export const setItemChangesAndSelectItem = createAction(
  '[item] setItemChangesAndSelectItem',
  props<{ itemChanges: ItemChanges[], itemId: number }>()
);

export const setHistory = createAction(
  '[item] setHistory',
  props<{ history: ItemChanges[] }>()
);

export const setItemChangesHistory = createAction(
  '[item] setItemChangesHistory',
  props<{ itemChangesHistory }>()
);

export const setItemDataHistory = createAction(
  '[item] setItemDataHistory',
  props<{ itemDataHistory: ItemDataHistory[] }>()
);

export const setItemDataMap = createAction(
  '[item] setItemDataMap',
  props<{ itemDataMap: ItemDataMap }>()
);

export const ShowImage = createAction(
  '[Item] Show Image',
  props<{ itemChangesId: number }>()
);

export const hideImage = createAction(
  '[item] hideImage',
  props<{ success: true }>()
);

export const setItemsByTestbedIdMap = createAction(
  '[item] setItemsByTestbedIdMap',
  props<{ testbedToItemDataMap: TestbedToItemDataMap }>()
);

export const SetTestbedSettings = createAction(
  '[Item] Set Testbed Settings',
  props<{ testbedSettings: TestbedSettings[], currentTestbedId: number }>()
);

export const toggleOnline = createAction(
  '[item] toggleOnline',
  props<{ item: ItemData, username: string }>()
);

export const toggleOnlineFailure = createAction(
  '[item] toggleOnlineFailure',
  props<{ error: Error }>()
);

export const toggleOnlineSuccess = createAction(
  '[item] toggleOnlineSuccess',
  props<{ itemData: ItemData }>()
);

export const toggleImage = createAction(
  '[Item] toggleImage',
  props<{ itemChangesId: number }>()
);

export const updateItemChange = createAction(
  '[item] updateItemChange',
  props<{ itemChange: ItemChanges }>()
);

export const updateItemChangeFailure = createAction(
  '[item] updateItemChangeFailure',
  props<{ error: Error }>()
);

export const updateItemChangeSuccess = createAction(
  '[item] updateItemChangeSuccess',
  props<{ itemChange: ItemChanges }>()
);

export const UpdateItemData = createAction(
  '[Item] Update Item Data',
  props<{ itemData: ItemData }>()
);

export const UpdateItemDataFailure = createAction(
  '[Item] Update Item Data Failure',
  props<{ error: Error }>()
);

export const updateItemDataSuccess = createAction(
  '[Item] updateItemDataSuccess',
  props<{ itemData: ItemData }>()
);

export const updateItemDescriptionFailure = createAction(
  '[item] updateItemDescriptionFailure',
  props<{ error: Error }>()
);

export const updateItemDescriptionSuccess = createAction(
  '[item] updateItemDescriptionSuccess',
  props<{ description: string, itemId: number }>()
);

export const updateItemStatus = createAction(
  '[item] updateItemStatus',
  props<{ itemStatus: ItemStatus }>()
);

export const updateItemStatusFailure = createAction(
  '[item] updateItemStatusFailure',
  props<{ error: Error }>()
);

export const updateItemStatusSuccess = createAction(
  '[item] updateItemStatusSuccess',
  props<{ itemStatus: ItemStatus }>()
);

export const toggleLockItem = createAction(
  '[item] toggleLockItem',
  props<{ locked: boolean, itemId: number }>()
);

export const toggleLockItemFailure = createAction(
  '[item] toggleLockedItemFailure',
  props<{ error: Error }>()
);

export const toggleLockItemSuccess = createAction(
  '[item] toggleLockItemSuccess',
  props<{ locked: boolean, itemId: number }>()
);

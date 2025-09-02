import { createSelector, createFeatureSelector } from '@ngrx/store';
import { cloneDeep } from 'lodash';

import { AppState } from '../app-store';
import { ItemState } from '../reducers/item.reducer';
import { Testbed, NumberTMap, TestbedToItemDataMap, ItemData, ItemDataMap } from '../models';
import { StateTrackerConstants } from '../consts/StateTrackerConstants';

export const getItemState = createFeatureSelector<AppState, ItemState>('item');

export const getComparisonList = createSelector(
  getItemState,
  (state: ItemState) => state.comparisonList
);

export const getHistory = createSelector(
  getItemState,
  (state: ItemState) => state.history
);

export const getItemChanges = createSelector(
  getItemState,
  (state: ItemState) => state.itemChanges
);

export const getItemDataMap = createSelector(
  getItemState,
  (state: ItemState) => state.itemDataMap
);

export const getItemDataMapWithChildren = createSelector(
  getItemDataMap,
  (itemDataMap: ItemDataMap) => {
    if (itemDataMap) {
      itemDataMap = cloneDeep(itemDataMap);
      const keys = Object.keys(itemDataMap);

      for (const key of keys) {
        if (itemDataMap[key].parentId !== null) {
          const parent = itemDataMap[itemDataMap[key].parentId];

          if (parent.children === null) {
            parent.children = [];
          }

          parent.children.push(itemDataMap[key]);
        }
      }
    }

    return itemDataMap;
  }
);

export const getItemsAsTree = createSelector(
  getItemDataMap,
  (itemDataMap: ItemDataMap) => {
    const itemDataList = [];

    if (itemDataMap) {
      itemDataMap = cloneDeep(itemDataMap);
      const keys = Object.keys(itemDataMap);

      for (const key of keys) {
        if (itemDataMap[key].parentId !== null) {
          const parent = itemDataMap[itemDataMap[key].parentId];

          if (parent.children === null) {
            parent.children = [];
          }

          parent.children.push(itemDataMap[key]);
        }
      }

      for (const key of keys) {
        if (itemDataMap[key].parentId === null) {
          itemDataList.push(itemDataMap[key]);
        }
      }
    }

    return sortItemDataTree(itemDataList);
  }
);

export const getHoveredImage = createSelector(
  getItemState,
  (state: ItemState) => state.hoveredImage
);

export const getItemChangesHistory = createSelector(
  getItemState,
  (state: ItemState) => state.itemChangesHistory
);

export const getItemDataHistory = createSelector(
  getItemState,
  (state: ItemState) => state.itemDataHistory
);

export const getItemStatusMap = createSelector(
  getItemDataMapWithChildren,
  (itemDataMap: ItemDataMap) => {
    return populateItemStatusMap(itemDataMap);
  }
)

export const getItemStatuses = createSelector(
  getItemState,
  (state: ItemState) => state.itemStatuses
);

export const getSelectedItem = createSelector(
  getItemState,
  (state: ItemState) => state.selectedItem
);

export const getSelectedTestbed = createSelector(
  getItemState,
  (state: ItemState) => state.selectedTestbed
);

export const getSelectedTestbedId = createSelector(
  getItemState,
  (state: ItemState) => state.selectedTestbedId
);

export const getCanEdit = createSelector(
  getItemState,
  (state: ItemState) => state.canEdit
);

export const getSnapshot = createSelector(
  getItemState,
  (state: ItemState) => state.snapshot
);

export const getTestbeds = createSelector(
  getItemState,
  (state: ItemState) => state.testbeds
);

export const getTestbedsAsList = createSelector(
  getItemState,
  (state: ItemState) => {
    const testbedList = [];

    for (const key of Object.keys(state.testbeds)) {
      testbedList.push(state.testbeds[key]);
    }

    return testbedList;
  }
);

export const getTestbedSettings = createSelector(
  getItemState,
  (state: ItemState) => state.testbedSettings
);

export const getTestbedToItemDataMap = createSelector(
  getItemState,
  (state: ItemState) => state.testbedToItemDataMap
);

export const getSelectedTestbedById = createSelector(
  getTestbeds,
  getSelectedTestbedId,
  (testbeds: NumberTMap<Testbed>, selectedTestbedId: number) => testbeds[selectedTestbedId]
);

export const getSelectedTestbedItems = createSelector(
  getItemState,
  getSelectedTestbed,
  (state: ItemState, selectedTestbed: Testbed) => {
    if (selectedTestbed) {
      return state.testbedToItemDataMap[selectedTestbed.id];
    }

    return null;
  }
);

export const getSelectedTestbedItemsAsList = createSelector(
  getTestbedToItemDataMap,
  getSelectedTestbedId,
  (testbedToItemDataMap: TestbedToItemDataMap, selectedTestbedId: number) => {
    const items: ItemData[] = [];

    if (selectedTestbedId) {
      for (const key of Object.keys(testbedToItemDataMap[selectedTestbedId])) {
        items.push(testbedToItemDataMap[selectedTestbedId][key]);
      }
    }

    return items;
  }
);

// Recursivly sort our item data tree. If an item is null move it to the end, otherwise sort in asc sort order.
function sortItemDataTree(itemDataList: ItemData[]): ItemData[] {
  for (const itemData of itemDataList)  {
    if (itemData.children !== null) {
      sortItemDataTree(itemData.children);
    }
  }

  return itemDataList.sort((a, b) => {
    if (!a.sortOrder) {
      return 0;
    } else if (!b.sortOrder) {
      return 1;
    }

    return a.sortOrder - b.sortOrder;
  });
}

function populateItemStatusMap(itemDataMap: ItemDataMap): Map<number, string[]> {
  const itemStatusMap = new Map();

  if (itemDataMap) {

    for (const key of Object.keys(itemDataMap)) {
      navigateTree(itemDataMap[key], itemDataMap, itemStatusMap, []);
    }
  }

  return itemStatusMap;
}

/**
 * Navigates up the component tree, populating a map that keeps a container ID mapped
 * to it's child statuses.
 * 
 * @param item The current item we're looking at.
 * @param itemDataMap The map of our objects.
 * @param statuses The current statuses we've seen while traversing up the tree.
 * @returns 
 */
function navigateTree(item: ItemData, itemDataMap: ItemDataMap, itemStatusMap: Map<number, string[]>, statuses: string[]): Map<number, string[]> {
  let currentStatuses = [];

  // Ignore the status of containers.
  if (!item.children) {
    // If the item doesn't have a status yet, it's Not Present / Absent.
    if (!item.latestChange || item.latestChange.status === null) {
      statuses.push(StateTrackerConstants.NOT_PRESENT_STATUS_ID.toString());
    } else {
      statuses.push(item.latestChange.status.toString());
    }
  } else if (itemStatusMap.get(item.id)) {
    currentStatuses = itemStatusMap.get(item.id);
  }

  // Only keep track of the statuses for container objects.
  if (item.children) {
    itemStatusMap.set(item.id, [ ...statuses, ...currentStatuses ]);
  }

  if (!item.parentId) {
    return itemStatusMap;
  }

  return navigateTree(itemDataMap[item.parentId], itemDataMap, itemStatusMap, statuses);
}

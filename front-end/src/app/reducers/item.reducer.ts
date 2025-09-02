import { createReducer, on } from '@ngrx/store';
import { keyBy } from 'lodash';

import {
  ItemChanges,
  ItemData,
  JSONOutputFormat,
  NumberTMap,
  ItemStatus,
  Testbed,
  TestbedSettings,
  TestbedToItemDataMap,
  ItemDataMap,
  Comparison,
  ItemDataHistory,
  ItemChangesHistory
} from '../models';
import { ItemActions, SnapshotActions, TestbedActions } from '../actions';

// TODO: Right now I'm adding some duplicateish properties with a plan to clean up this reducer significantly.
export interface ItemState {
  itemChangesHistory: ItemChangesHistory[];
  itemDataMap: ItemDataMap;
  itemDataHistory: ItemDataHistory[];
  comparisonList: Comparison[];
  exportData: JSONOutputFormat[];
  history: ItemChanges[];
  images: NumberTMap<Blob>;
  hoveredImage: Blob;
  itemChanges: ItemChanges[];
  itemStatuses: NumberTMap<ItemStatus>;
  selectedItem: ItemData | null;
  canEdit: boolean;
  selectedTestbed: Testbed | null;
  selectedTestbedId: number | null;
  snapshot: ItemData[];
  testbeds: NumberTMap<Testbed>;
  testbedSettings: TestbedSettings[];
  testbedToItemDataMap: TestbedToItemDataMap;
}

export const initialState: ItemState = {
  itemChangesHistory: [],
  itemDataMap: null,
  itemDataHistory: [],
  comparisonList: [],
  exportData: [],
  history: [],
  images: {},
  hoveredImage: null,
  itemChanges: [],
  itemStatuses: {},
  selectedItem: null,
  canEdit: false,
  selectedTestbed: null,
  selectedTestbedId: null,
  snapshot: [],
  testbeds: {},
  testbedSettings: [],
  testbedToItemDataMap: {},
};

export const reducer = createReducer(
  initialState,
  on(ItemActions.createItemDataSuccess, (state, { itemData }) => ({
    ...state,
    testbedToItemDataMap: {
      ...state.testbedToItemDataMap,
      [state.selectedTestbedId]: {
        ...state.testbedToItemDataMap[state.selectedTestbedId],
        [itemData.id]: {
          ...itemData
        }
      }
    }
  })),
  on(ItemActions.createItemStatusSuccess, (state, action) =>
    modifyItemStatus(state, action.itemStatus)
  ),
  on(ItemActions.DeleteItemChangesSuccess, (state, { deleted, id }) => {
    const itemChanges = [
      ...state.itemChanges
    ];

    for (const itemChange of itemChanges) {
      if (itemChange.id === id) {
        itemChanges.splice(itemChanges.indexOf(itemChange), 1);
      }
    }

    const history = [
      ...state.history
    ];

    for (const historyItem of history) {
      if (historyItem.id === id) {
        history.splice(history.indexOf(historyItem), 1);
      }
    }

    return {
      ...state,
      history: [
        ...history
      ],
      itemChanges: [
        ...itemChanges
      ]
    };
  }),
  on(ItemActions.setItemDataMap, (state, { itemDataMap }) => ({
    ...state,
    itemDataMap: {
      ...itemDataMap
    }
  })),
  on(ItemActions.ItemChangesModifySuccess, (state, { itemChanges }) => ({
    ...state,
    itemChanges: [
      ...state.itemChanges,
      itemChanges
    ],
    selectedItem: {
      ...state.selectedItem,
      latestChange: itemChanges
    }
  })),
  on(SnapshotActions.fetchComparisonSuccess, (state, { comparisonList }) => ({
    ...state,
    comparisonList: [
      ...comparisonList ? [...comparisonList] : []
    ]
  })),
  on(ItemActions.fetchSnapshotSuccess, (state, { snapshot }) => ({
    ...state,
    snapshot: snapshot ? [...snapshot] : []
  })),
  on(ItemActions.setItemChangesHistory, (state, { itemChangesHistory }) => ({
    ...state,
    itemChangesHistory: [
      ...itemChangesHistory ? itemChangesHistory : []
    ]
  })),
  on(ItemActions.setItemDataHistory, (state, { itemDataHistory }) => ({
    ...state,
    itemDataHistory: [
      ...itemDataHistory ? itemDataHistory : []
    ]
  })),
  on(TestbedActions.setTestbeds, (state, { testbeds }) => {
    // Handle no testbeds if the app doesn't have any data yet.
    if (!testbeds) {
      return {
        ...state,
        testbeds: {}
      };
    }

    return {
      ...state,
      testbeds: testbeds.length > 0 ? keyBy(testbeds, 'id') : {}
    };
  }),
  on(ItemActions.getImageSuccess, (state, action) => {
    if (action.image) {
      return {
        ...state,
        images: {
          ...state.images,
          [action.itemChangesId]: action.image.slice()
        }
      };
    }

    return {
      ...state,
      images: {
        ...state.images
      }
    };
  }),
  on(ItemActions.updateItemChangeSuccess, (state, { itemChange }) => {
    const history = [...state.history];
    const itemChanges = [...state.itemChanges];

    for (const change of history) {
      if (change.id === itemChange.id) {
        history[history.indexOf(change)] = { ...itemChange };

        break;
      }
    }

    for (const change of itemChanges) {
      if (change.id === itemChange.id) {
        itemChanges[itemChanges.indexOf(change)] = { ...itemChange };
      }

      break;
    }

    return {
      ...state,
      itemChanges: [
        ...itemChanges
      ],
      history: [
        ...history
      ]
    };
  }),
  on(ItemActions.updateItemDescriptionSuccess, (state, { description, itemId }) => {
    const item = { ...state.selectedItem };

    item.description = description;

    return {
      ...state,
      selectedItem: {
        ...item
      }
    };
  }),
  on(TestbedActions.updateSortOrderSuccess, (state, { sortOrder, testbedId }) => ({
    ...state,
    testbeds: {
      ...state.testbeds,
      [testbedId]: {
        ...state.testbeds[testbedId],
        sortOrder
      }
    }
  })),
  on(TestbedActions.updateTestbedDescriptionSuccess, (state, { description, testbedId }) => {
    const testbed = { ...state.testbeds[testbedId] };

    testbed.description = description;

    return {
      ...state,
      testbeds: {
        ...state.testbeds,
        [testbedId]: {
          ...testbed
        }
      }
    };
  }),
  on(ItemActions.updateItemDataSuccess, (state, { itemData }) => ({
    ...state,
    testbedToItemDataMap: {
      [state.selectedTestbedId]: {
        ...state.testbedToItemDataMap[state.selectedTestbedId],
        [itemData.id]: {
          ...itemData
        }
      }
    }
  })),
  on(ItemActions.updateItemStatusSuccess, (state, action) =>
    modifyItemStatus(state, action.itemStatus)
  ),
  on(TestbedActions.selectTestbed, (state, { testbedId }) => {
    if (!testbedId) {
      return {
        ...state,
        itemStatuses: null,
        selectedTestbed: null,
        selectedTestbedId: testbedId
      };
    }

    const currentTestbed: Testbed = state.testbeds[testbedId];

    return {
      ...state,
      selectedTestbed: currentTestbed,
      selectedTestbedId: testbedId,
      itemStatuses: keyBy(currentTestbed.statuses, 'id'),
    };
  }),
  on(ItemActions.setItemChangesAndSelectItem, (state, { itemChanges, itemId }) => {
    const { itemDataMap } = state;

    if (itemId !== null && itemDataMap && itemDataMap[itemId]) {
      const selectedItem = itemDataMap[itemId];

      if (!itemChanges) {
        itemChanges = [];
      }

      return {
        ...state,
        selectedItem,
        canEdit: checkCanEdit(itemDataMap, selectedItem),
        itemChanges
      };
    }

    return {
      ...state,
      selectedItem: null,
      itemChanges
    };
  }),
  on(ItemActions.setHistory, (state, { history }) => {
    const exportData = new Array<JSONOutputFormat>();

    // If there aren't any item changes, history can be null.
    if (state.itemDataMap && Object.keys(state.itemDataMap).length > 0) {
      if (history) {
        for (const historyItem of history) {
          const currentItem = state.itemDataMap[historyItem.itemId];

          if (currentItem !== undefined) {
            const exportItem: JSONOutputFormat = {
              name: currentItem.name,
              fullname: currentItem.fullname,
              ...historyItem
            };

            if (exportItem.status) {
              exportItem.status = state.itemStatuses[exportItem.status].status;
            }

            exportData.push(exportItem);
          }
        }
      }
    }

    return {
      ...state,
      exportData,
      history
    };
  }),
  on(ItemActions.setItemsByTestbedIdMap, (state, { testbedToItemDataMap }) => ({
    ...state,
    testbedToItemDataMap
  })),
  on(ItemActions.SetTestbedSettings, (state, { testbedSettings }) => ({
    ...state,
    testbedSettings: testbedSettings ? testbedSettings : []
  })),
  on(TestbedActions.updateTestbedSettingsSuccess, (state, { testbedSettings }) => {
    const testbedSettingsList = [
      ...state.testbedSettings
    ];
    let index = 0;

    for (const settings of state.testbedSettings) {
      if (testbedSettings.id === settings.id) {
        break;
      }

      index++;
    }

    testbedSettingsList[index] = {
      ...testbedSettings
    };

    return {
      ...state,
      testbedSettings: [
        ...testbedSettingsList
      ]
    };
  }),
  on(ItemActions.ShowImage, (state, action) => ({
    ...state,
    hoveredImage: state.images[action.itemChangesId]
  })),
  on(ItemActions.toggleOnlineSuccess, (state, { itemData }) => {
    itemData = {
      ...itemData,
      children: []
    };

    return {
      ...state,
      itemDataMap: {
        ...state.itemDataMap,
        [itemData.id]: {
          ...itemData
        }
      }
    };
  }),
  on(ItemActions.deleteItemSuccess, (state, { itemId }) => {
    const testbedItems = {
      ...state.testbedToItemDataMap[state.selectedTestbedId]
    };

    // Remove our deleted item.
    delete testbedItems[itemId];

    return {
      ...state,
      testbedToItemDataMap: {
        [state.selectedTestbedId]: {
          ...testbedItems
        }
      }
    };
  }),
  on(ItemActions.toggleLockItemSuccess, (state, { locked, itemId }) => ({
    ...state,
    testbedToItemDataMap: {
      [state.selectedTestbedId]: {
        ...state.testbedToItemDataMap[state.selectedTestbedId],
        [itemId]: {
          ...state.testbedToItemDataMap[state.selectedTestbedId][itemId],
          locked
        }
      }
    }
  })),
  on(ItemActions.hideImage, (state) => ({
    ...state,
    hoveredImage: null
  }))
);

/**
 * Check recursivly up the tree to see if an item can be edited based on it's online property.
 * @param itemDataMap 
 * @param itemData
 */
function checkCanEdit(itemDataMap: ItemDataMap, itemData: ItemData): boolean {
  // If we reach the top of the tree or come across a disabled parent, return.
  if (!itemData.parentId || !itemData.online) {
    return itemData.online;
  }

  return checkCanEdit(itemDataMap, itemDataMap[itemData.parentId]);
}

function modifyItemStatus(state: ItemState, modifiedItemStatus: ItemStatus): ItemState {
  const selectedTestbedStatuses = [
    ...state.testbeds[modifiedItemStatus.testbedId].statuses
  ];
  let index = 0;

  /**
   * TODO:
   * Once our itemStatuses are normalized from the backend, remove this
   * and use the id as the index.
   *
   * Until then, find the index of the state we just updated.
   */
  for (const itemStatus of selectedTestbedStatuses) {
    if (modifiedItemStatus.id === itemStatus.id) {
      break;
    }

    index++;
  }

  selectedTestbedStatuses[index] = modifiedItemStatus;

  return {
    ...state,
    testbeds: {
      ...state.testbeds,
      [modifiedItemStatus.testbedId]: {
        ...state.testbeds[modifiedItemStatus.testbedId],
        statuses: [
          ...selectedTestbedStatuses
        ]
      }
    }
  };
}

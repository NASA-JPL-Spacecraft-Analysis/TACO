import { createSelector, createFeatureSelector } from '@ngrx/store';

import { AppState } from '../app-store';
import { StructureState } from '../reducers/structure.reducer';
import { ItemStructure, ItemData } from '../models';

export const getStructureState = createFeatureSelector<AppState, StructureState>('structure');

export const getStructureErrors = createSelector(
  getStructureState,
  (state: StructureState) => state.error
);

export const getPreviewStatuses = createSelector(
  getStructureState,
  (state: StructureState) => state.structure.statuses
);

export const getPreviewTestbedData = createSelector(
  getStructureState,
  (state: StructureState) => state.structure.testbedStructure
);

export const getPreviewItemData = createSelector(
  getStructureState,
  (state: StructureState) => {

    // TODO: maybe extract this logic into somewhere else for cleaner structure
    function itemConfigToData(config: ItemStructure): ItemData {
      const dataChildren = config.children ?
        config.children.map(itemConfigToData)
        : null;

      const data: ItemData = {
        ...config,
        description: '',
        // convert all children items as well
        children: dataChildren,

        // since it's just for debug visualization, dummy values are fine
        id: 0,
        testbedId: 0,
        parentId: 0,
        locked: false,
        sortOrder: null,
        latestChange: null,
      };

      return data;
    }

    if (!state.structure || !state.structure.testbedStructure || !state.structure.testbedStructure.items) {
      return null;
    }

    // convert config to ItemData[] so that item-group component can
    // render it correctly
    return state.structure.testbedStructure.items.map(itemConfigToData);
  }
);

import { createReducer, on } from '@ngrx/store';

import { JsonStructure } from '../models';
import { StructureActions } from '../actions';
import { StateTrackerConstants } from '../consts/StateTrackerConstants';

export interface StructureState {
  error: Error;
  structure: JsonStructure;
}

export const initialState: StructureState = {
  structure: null,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(StructureActions.clearPreviewData, (state) => ({
    ...state,
    structure: {
      statuses: undefined,
      testbedStructure: {
        acronym: undefined,
        items: null,
        name: undefined
      }
    }
  })),
  on(StructureActions.PreviewTestbedStructureSuccess, (state, { structure }) => {
    const statuses = [
      ...structure.statuses,
      {
        status: StateTrackerConstants.NOT_PRESENT_TEXT,
        color: '#a9a9a9'
      }
    ];

    return {
      ...state,
      error: null,
      structure: {
        ...structure,
        statuses: [
          ...statuses
        ]
      }
    };
  }),
  on(StructureActions.PreviewTestbedStructureFailure, (state, { error }) => ({
    ...state,
    structure: null,
    error
  }))
);

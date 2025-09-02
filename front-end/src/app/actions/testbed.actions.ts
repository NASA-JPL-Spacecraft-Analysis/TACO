import { createAction, props } from '@ngrx/store';

import { Testbed, TestbedSettings } from '../models';

export const clearSortOrderFailure = createAction(
  '[testbed] clearSortOrderFailure',
  props<{ error: Error }>()
);

export const clearSortOrderSuccess = createAction(
  '[testbed] clearSortOrderSuccess',
  props<{ testbedId: number }>()
);

export const setTestbeds = createAction(
  '[testbed] setTestbeds',
  props<{ testbeds: Testbed[], testbedId?: number }>()
);

export const fetchTestbedsFailure = createAction(
  '[testbed] fetchTestbedsFailure',
  props<{ error: Error }>()
);

export const saveTestbedDescription = createAction(
  '[testbed] saveTestbedDescription',
  props<{ description: string, testbedId: number }>()
);

export const selectTestbed = createAction(
  '[testbed] selectTestbed',
  props<{ testbedId: number }>()
);

export const updateSortOrder = createAction(
  '[testbed] updateSortOrder',
  props<{ sortOrder: number, testbedId: number }>()
);

export const updateSortOrderFailure = createAction(
  '[testbed] updateSortOrderFailure',
  props<{ error: Error }>()
);

export const updateSortOrderSuccess = createAction(
  '[testbed] updateSortOrderSuccess',
  props<{ sortOrder: number, testbedId: number }>()
);

export const updateTestbedDescriptionFailure = createAction(
  '[testbed] updateTestbedDescriptionFailure',
  props<{ error: Error }>()
);

export const updateTestbedDescriptionSuccess = createAction(
  '[testbed] updateTestbedDescriptionSuccess',
  props<{ description: string, testbedId: number }>()
);

export const updateTestbedSettings = createAction(
  '[testbed] updateTestbedSettings',
  props<{ testbedSettings: TestbedSettings }>()
);

export const updateTestbedSettingsFailure = createAction(
  '[testbed] updateTestbedSettingsFailure',
  props<{ error: Error }>()
);

export const updateTestbedSettingsSuccess = createAction(
  '[testbed] updateTestbedSettingsSuccess',
  props<{ testbedSettings: TestbedSettings }>()
);

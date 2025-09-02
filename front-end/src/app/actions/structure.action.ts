import { createAction, props } from '@ngrx/store';

import { JsonStructure } from '../models';

export const clearPreviewData = createAction(
  '[structure] clearPreviewData',
  props<{ clearPreviewData: true }>()
);

export const PreviewTestbedStructure = createAction(
  '[Structure] Preview Structure Config',
  props<{ file: File }>()
);

export const PreviewTestbedStructureSuccess = createAction(
  '[Structure] Preview Testbed Structure Success',
  props<{ structure: JsonStructure }>()
);

export const PreviewTestbedStructureFailure = createAction(
  '[Structure] Preview Testbed Structure Failure',
  props<{ error: Error }>()
);

export const UploadTestbedStructure = createAction(
  '[Structure] Upload Testbed Structure',
  props<{ structure: JsonStructure }>()
);

export const UploadTestbedStructureFailure = createAction(
  '[Structure] Upload Testbed Structure Failure',
  props<{ error: Error }>()
);

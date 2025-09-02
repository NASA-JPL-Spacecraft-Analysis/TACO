import { createAction, props } from '@ngrx/store';

import { Comparison } from '../models';

export const fetchComparison = createAction(
  '[snapshot] fetchComparison',
  props<{ startDateTime: string, endDateTime: string, testbedId: number }>()
);

export const fetchComparisonFailure = createAction(
  '[snapshot] fetchComparisonFailure',
  props<{ error: Error }>()
);

export const fetchComparisonSuccess = createAction(
  '[snapshot] fetchComparisonSuccess',
  props<{ comparisonList: Comparison[] }>()
);

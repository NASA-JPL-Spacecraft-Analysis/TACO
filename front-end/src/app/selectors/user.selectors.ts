import { createSelector, createFeatureSelector } from '@ngrx/store';

import { UserState } from '../reducers/user.reducer';
import { AppState } from '../app-store';

export const getUserState = createFeatureSelector<AppState, UserState>('user');

export const getIsAdmin = createSelector(
  getUserState,
  (state: UserState) => state.isAdmin
);

export const getUserCanEdit = createSelector(
  getUserState,
  (state: UserState) => state.userCanEdit
);

export const getUsername = createSelector(
  getUserState,
  (state: UserState) => state.username
);


import { createAction, props } from '@ngrx/store';

export const fetchCanEditFailure = createAction(
  '[user] fetchCanEditFailure',
  props<{ error: Error }>()
);

export const fetchIsAdminFailure = createAction(
  '[user] fetchIsAdminFailure',
  props<{ error: Error }>()
);

export const fetchUsernameFailure = createAction(
  '[user] fetchUsernameError',
  props<{ error: Error }>()
);

export const setCanEdit = createAction(
  '[user] setCanEdit',
  props<{ userCanEdit: boolean }>()
);

export const setIsAdmin = createAction(
  '[user] setIsAdmin',
  props<{ isAdmin: boolean }>()
);

export const setUsername = createAction(
  '[user] setUsername',
  props<{ username: string }>()
);

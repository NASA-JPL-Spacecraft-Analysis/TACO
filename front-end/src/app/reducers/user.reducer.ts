import { createReducer, on } from '@ngrx/store';

import { UserActions } from '../actions';

export interface UserState {
  username: string;
  userCanEdit: boolean;
  isAdmin: boolean;
}

export const initialState: UserState = {
  username: '',
  userCanEdit: undefined,
  isAdmin: false
};

export const reducer = createReducer(
  initialState,
  on(UserActions.setCanEdit, (state, { userCanEdit }) => ({
    ...state,
    userCanEdit
  })),
  on(UserActions.setIsAdmin, (state, action) => ({
    ...state,
    isAdmin: action.isAdmin
  })),
  on(UserActions.setUsername, (state, action) => {
    return {
      ...state,
      username: action.username
    }
  })
);

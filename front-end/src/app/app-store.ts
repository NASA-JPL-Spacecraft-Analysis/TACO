import { InjectionToken } from '@angular/core';
import { ActionReducerMap, Action, MetaReducer, ActionReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { environment } from 'src/environments/environment';
import { ConfigReducer, ItemReducer, StructureReducer, UserReducer } from './reducers';
import { ConfigState } from './config';

export interface AppState {
  config: ConfigState;
  item: ItemReducer.ItemState;
  router: fromRouter.RouterReducerState;
  structure: StructureReducer.StructureState;
  user: UserReducer.UserState;
}

export const ROOT_REDUCERS = new InjectionToken<
  ActionReducerMap<AppState, Action>
>('Root reducers token', {
  factory: () => ({
    config: ConfigReducer.reducer,
    item: ItemReducer.reducer,
    router: fromRouter.routerReducer,
    structure: StructureReducer.reducer,
    user: UserReducer.reducer
  })
});

export function logger(
  reducer: ActionReducer<AppState>,
): ActionReducer<AppState> {
  return (state: AppState, action: any): AppState => {
    const result = reducer(state, action);

    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];

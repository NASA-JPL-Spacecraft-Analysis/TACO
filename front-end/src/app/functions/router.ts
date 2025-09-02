import { RouterNavigatedAction, ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RouterState } from '../app-routing.module';

export function isRoute(route: string | string[] | RegExp): (action: Action) => boolean {
  return (action: Action) => {
    if (action.type === ROUTER_NAVIGATED) {
      const routerAction = action as RouterNavigatedAction<RouterState>;
      const { path } = routerAction.payload.routerState;

      if (Array.isArray(route)) {
        return route.indexOf(path) > -1;
      } else if (route instanceof RegExp) {
        route.test(path);
      }

      return route === path;
    }

    return false;
  };
}

export function ofRoute(route: string | string[] | RegExp): MonoTypeOperatorFunction<Action> {
  return filter<Action>(isRoute(route));
}

export function mapToParam<T>(key: string): OperatorFunction<RouterNavigatedAction<RouterState>, T> {
  return map<RouterNavigatedAction<RouterState>, T>(
    routerAction => routerAction.payload.routerState.params[key],
  );
}

export function mapToParams<_>(): OperatorFunction<RouterNavigatedAction<RouterState>, any> {
  return map<RouterNavigatedAction<RouterState>, any>(action => action.payload.routerState.params);
}

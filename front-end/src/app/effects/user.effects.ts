import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';

import { UserActions, ItemActions } from '../actions';
import { UserService } from '../services/user.service';

@Injectable()
export class UserEffects {
  constructor(
    private actions: Actions,
    private userService: UserService
  ) {}

  public fetchUserSuccess = createEffect(() => {
    return this.actions.pipe(
      ofType(UserActions.setUsername),
      switchMap(({ username }) =>
        this.userService.getIsAdmin()
        .pipe(
          map(isAdmin => UserActions.setIsAdmin({
            isAdmin
          })),
          catchError(
            (error: Error) => [
              UserActions.fetchIsAdminFailure({
                error
              })
            ]
          )
        )
      )
    );
  });

  public setTestbedSettings = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.SetTestbedSettings),
      switchMap(({ testbedSettings, currentTestbedId }) => {
        if (currentTestbedId) {
          return this.userService.getCanEdit(
            currentTestbedId
          ).pipe(
            map(userCanEdit => UserActions.setCanEdit({
              userCanEdit
            })),
            catchError(
              (error: Error) => [
                UserActions.fetchCanEditFailure({
                  error
                })
              ]
            )
          );
        }

        return [];
      })
    );
  });
}

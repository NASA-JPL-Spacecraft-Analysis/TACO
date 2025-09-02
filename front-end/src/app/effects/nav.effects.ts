import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { merge, concat, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { ofRoute, mapToParam, mapToParams } from '../functions/router';

import { ItemService } from '../services/item.service';
import { UserService } from '../services/user.service';
import { ItemActions, TestbedActions, UserActions } from '../actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NavEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private itemService: ItemService,
    private userService: UserService
  ) {}

  public effectsInit = createEffect(() =>
    this.actions.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(_ =>
        this.userService.getUser().pipe(
          map(user => UserActions.setUsername({
            username: user.userId
          }),
          catchError(
            (error: Error) => [
              UserActions.fetchUsernameFailure({
                error
              })
            ]
          )
        )
      )
    )
  ));

  public navTestbedById = createEffect(() =>
    this.actions.pipe(
      ofRoute('testbed/:testbedId'),
      mapToParam<number>('testbedId'),
      switchMap(testbedId =>
        merge(
          this.itemService.getItemData(
            testbedId
          ).pipe(
            map(itemDataMap => ItemActions.setItemDataMap({
              itemDataMap
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchItemDataMapFailure({
                  error
                })
              ]
            )
          ),
          this.itemService.getTestbeds().pipe(
            map(testbeds => TestbedActions.setTestbeds({
              testbeds,
              testbedId
            })),
            catchError(
              (error: Error) => [
                TestbedActions.fetchTestbedsFailure({
                  error
                })
              ]
            )
          ),
          this.itemService.getTestbedSettings().pipe(
            map(testbedSettings => ItemActions.SetTestbedSettings({
              testbedSettings,
              currentTestbedId: testbedId
            })),
            catchError(
              (error: Error) => [
                ItemActions.FetchTestbedSettingsFailure({ error })
              ]
            )
          ),
          this.userService.getUser().pipe(
            map(user => UserActions.setUsername({
              username: user.userId
            })),
            catchError(
              (error: Error) => [
                UserActions.fetchUsernameFailure({
                  error
                })
              ]
            )
          )
        )
      )
    )
  );

  public navItemById = createEffect(() =>
    this.actions.pipe(
      ofRoute('testbed/:testbedId/item/:itemId'),
      mapToParams(),
      switchMap(params => {
        const { testbedId, itemId } = params;

        return concat(
          this.itemService.getTestbeds().pipe(
            map(testbeds => TestbedActions.setTestbeds({
              testbeds,
              testbedId
            })),
            catchError(
              (error: Error) => [
                TestbedActions.fetchTestbedsFailure({
                  error
                })
              ]
            )
          ),
          this.itemService.getTestbedSettings().pipe(
            map(testbedSettings => ItemActions.SetTestbedSettings({
              testbedSettings,
              currentTestbedId: testbedId
            })),
            catchError(
              (error: Error) => [
                ItemActions.FetchTestbedSettingsFailure({ error })
              ]
            )
          ),
          this.itemService.getItemData(
            testbedId
          ).pipe(
            map(itemDataMap => ItemActions.setItemDataMap({
              itemDataMap
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchItemDataMapFailure({
                  error
                })
              ]
            )
          ),
          this.itemService.getItemChangesById(
            itemId
          ).pipe(
            map(itemChanges => ItemActions.setItemChangesAndSelectItem({
              itemChanges,
              itemId
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchItemChangesFailure({
                  error
                })
              ]
            )
          ),
          this.userService.getUser().pipe(
            map(user => UserActions.setUsername({
              username: user.userId
            })),
            catchError(
              (error: Error) => [
                UserActions.fetchUsernameFailure({
                  error
                })
              ]
            )
          )
        );
      })
    )
  );

  public navHistory = createEffect(() =>
    this.actions.pipe(
      ofRoute([
        'testbed/:testbedId/history',
        'testbed/:testbedId/snapshot',
        'testbed/:testbedId/snapshot/comparison'
      ]),
      mapToParam<number>('testbedId'),
      switchMap(testbedId =>
        merge(
          this.itemService.getItemData(
            testbedId
          ).pipe(
            map(itemDataMap => ItemActions.setItemDataMap({
              itemDataMap
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchItemDataMapFailure({
                  error
                })
              ]
            )
          ),
          this.itemService.getTestbeds().pipe(
            map(testbeds => TestbedActions.setTestbeds({
              testbeds,
              testbedId
            })),
            catchError(
              (error: Error) => [
                TestbedActions.fetchTestbedsFailure({
                  error
                })
              ]
            )
          ),
          this.itemService.getHistory(
            testbedId
          ).pipe(
            map(history => ItemActions.setHistory({
              history
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchHistoryFailure({
                  error
                })
              ]
            )
          )
        )
      )
    )
  );

  public navUploadStructure = createEffect(() =>
    this.actions.pipe(
      ofRoute([
        'admin',
        'help',
        'upload'
      ]),
      switchMap(_ =>
        this.itemService.getTestbeds().pipe(
          map(testbeds => TestbedActions.setTestbeds({
            testbeds,
            testbedId: null
          })),
          catchError(
            (error: Error) => [
              TestbedActions.fetchTestbedsFailure({
                error
              })
            ]
          )
        )
      )
    )
  );

  public navManagement = createEffect(() =>
    this.actions.pipe(
      ofRoute('admin'),
      switchMap(_ =>
        concat(
          of(TestbedActions.selectTestbed({
            testbedId: null
          })),
          this.itemService.getTestbedSettings().pipe(
            map(testbedSettings => ItemActions.SetTestbedSettings({
              testbedSettings,
              currentTestbedId: undefined
            })),
            catchError(
              (error: Error) => [
                ItemActions.FetchTestbedSettingsFailure({ error })
              ]
            )
          ),
          this.itemService.getItemsByTestbedId().pipe(
            map(testbedToItemDataMap => ItemActions.setItemsByTestbedIdMap({
              testbedToItemDataMap
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchItemDataMapFailure({
                  error
                })
              ]
            )
          ),
          this.authService.getItemChangesHistory().pipe(
            map(itemChangesHistory => ItemActions.setItemChangesHistory({
              itemChangesHistory
            })),
            catchError((error: Error) => [
              ItemActions.fetchItemChangesHistoryFailure({
                error
              })
            ])
          ),
          this.authService.getItemDataHistory().pipe(
            map(itemDataHistory => ItemActions.setItemDataHistory({
              itemDataHistory
            })),
            catchError((error: Error) => [
              ItemActions.fetchItemDataHistoryFailure({
                error
              })
            ])
          )
        )
      )
    )
  );
}

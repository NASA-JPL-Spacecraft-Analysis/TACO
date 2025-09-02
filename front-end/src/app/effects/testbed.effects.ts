import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, catchError } from 'rxjs/operators';
import { keyBy } from 'lodash';

import { TestbedActions, ToastActions } from '../actions';
import { AuthService } from '../services/auth.service';
import { TestbedSettings } from '../models';
import { ItemService } from '../services/item.service';
import { Toast } from 'ngx-toastr';

@Injectable()
export class TestbedEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private itemService: ItemService,
    private router: Router
  ) {}

  public fetchTestbedsSuccess = createEffect(() =>
    this.actions.pipe(
      ofType(TestbedActions.setTestbeds),
      switchMap(({ testbeds, testbedId }) => {
        // If we don't have any testbeds, redirect the user to the upload page.
        if (!testbeds) {
          this.router.navigateByUrl('upload');

          return [];
        }

        const currentUrl = this.router.url;

        // If the user is trying to get to one of the following pages, don't try and redirect.
        if (currentUrl === '/admin'
            || currentUrl === '/help'
            || currentUrl === '/upload') {
          return [];
        }

        /**
         * If our id is undefined or null
         * OR if our testbed isn't valid, redirect the user to the first testbed.
         */
        if (!testbedId ||
          (keyBy(testbeds, 'id')[testbedId] === undefined)) {
          const firstTestbedId = testbeds[Object.keys(testbeds)[0]].id;

          this.router.navigate([ 'testbed/' + firstTestbedId ]);

          testbedId = firstTestbedId;
        }

        return [
          TestbedActions.selectTestbed({
            testbedId
          })
        ];
      })
    )
  );

  public saveTestbedDescription = createEffect(() => {
    return this.actions.pipe(
      ofType(TestbedActions.saveTestbedDescription),
      switchMap(({ description, testbedId }) =>
        this.itemService.putTestbedDescription(
          description,
          testbedId
        ).pipe(
          switchMap((savedDescription: string) => [
            TestbedActions.updateTestbedDescriptionSuccess({
              description: savedDescription,
              testbedId
            }),
            ToastActions.showToast({
              message: 'Testbed description updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            TestbedActions.updateTestbedDescriptionFailure({
              error
            }),
            ToastActions.showToast({
              message: 'Testbed description was not updated',
              toastType: 'error'
            })
          ])
        )
      )
    );
  });

  public updateSortOrder = createEffect(() =>
    this.actions.pipe(
      ofType(TestbedActions.updateSortOrder),
      switchMap(({ sortOrder, testbedId }) =>
        this.authService.updateSortOrder(
          sortOrder,
          testbedId
        ).pipe(
          switchMap((updatedSortOrder: number) => [
            TestbedActions.updateSortOrderSuccess({
              sortOrder: updatedSortOrder,
              testbedId
            }),
            ToastActions.showToast({
              message: 'Sort order updated',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            TestbedActions.updateSortOrderFailure({
              error
            }),
            ToastActions.showToast({
              message: 'Sort order was not updated',
              toastType: 'error'
            })
          ])
        )
      )
    )
  );

  public updateTestbedSettings = createEffect(() => {
    return this.actions.pipe(
      ofType(TestbedActions.updateTestbedSettings),
      switchMap(({ testbedSettings }) => {
        return this.authService.updateTestbedSettings(
          testbedSettings
        ).pipe(
          switchMap((updatedTestbedSettings: TestbedSettings) => [
            TestbedActions.updateTestbedSettingsSuccess({
              testbedSettings: updatedTestbedSettings
            }),
            ToastActions.showToast({
              message: 'Testbed settings updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            TestbedActions.updateTestbedSettingsFailure({
              error
            }),
            ToastActions.showToast({
              message: 'Testbed settings were not updated',
              toastType: 'error'
            })
          ])
        );
      })
    );
  });
}

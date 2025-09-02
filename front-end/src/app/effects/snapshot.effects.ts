import { Injectable } from '@angular/core';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';

import { SnapshotActions, ToastActions } from '../actions';
import { SnapshotService } from './../services';

@Injectable()
export class SnapshotEffects{
  constructor(
    private actions: Actions,
    private snapshotService: SnapshotService 
  ) {}

  public fetchComparisons = createEffect(() =>
    this.actions.pipe(
      ofType(SnapshotActions.fetchComparison),
      switchMap(({ startDateTime, endDateTime, testbedId }) =>
        this.snapshotService.getComparisons(
          startDateTime,
          endDateTime,
          testbedId
        ).pipe(
          map(comparisonList =>
            SnapshotActions.fetchComparisonSuccess({
              comparisonList
            })
          ),
          catchError(
            (error: Error) => [
              SnapshotActions.fetchComparisonFailure({
                error
              }),
              ToastActions.showToast({
                message: 'Fetch comparisons failed',
                toastType: 'error'
              })
            ]
          )
        )
      )
    )
  );
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, map, switchMap, catchError } from 'rxjs/operators';

import { StructureActions } from '../actions';
import { JsonStructure, Testbed, TestbedStructure } from '../models';
import { StructureService } from '../services/structure.service';
import { AppState } from '../app-store';
import { StateTrackerConstants } from '../consts/StateTrackerConstants';

@Injectable()
export class StructureEffects {
  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private structureService: StructureService,
    private router: Router
  ) { }

  public previewTestbedStructure = createEffect(() =>
    this.actions.pipe(
      ofType(StructureActions.PreviewTestbedStructure),
      withLatestFrom(this.store),
      map(([ action ]) => ({ action })),
      switchMap(({ action }) => {
        return this.structureService.previewJsonStructure(
          action.file
        ).pipe(
          switchMap(
            (structure: JsonStructure) => [
              StructureActions.PreviewTestbedStructureSuccess({
                structure
              })
            ]
          ),
          catchError(
            (error: Error) => [
              StructureActions.PreviewTestbedStructureFailure({ error })
            ]
          )
        );
      })
    )
  );

  public uploadTestbedStructure = createEffect(() =>
    this.actions.pipe(
      ofType(StructureActions.UploadTestbedStructure),
      withLatestFrom(this.store),
      map(([, state ]) => ({ state })),
      switchMap(({ state }) => {
        let structure: JsonStructure = {
          ...state.structure.structure
        };
        const statuses = [
          ...state.structure.structure.statuses
        ];
        let index = 0;
        let notPresentStatusIndex = null;

        // Find the index of our temp Not Present status and remove it before saving.
        for (const status of statuses) {
          if (status.status === StateTrackerConstants.NOT_PRESENT_TEXT) {
            notPresentStatusIndex = index;
          }

          index++;
        }

        statuses.splice(notPresentStatusIndex, 1);

        structure = {
          statuses,
          testbedStructure: structure.testbedStructure
        };

        return this.structureService.uploadJsonStructure(
          state.config.app.baseUrl,
          structure
        ).pipe(
          switchMap((testbed: Testbed) => {
            this.router.navigateByUrl('testbed/' + testbed.id);

            return [
              StructureActions.clearPreviewData({
                clearPreviewData: true
              })
            ];
          }),
          catchError((error: Error) => [
            StructureActions.UploadTestbedStructureFailure({ error })
          ])
        );
      })
    )
  );
}

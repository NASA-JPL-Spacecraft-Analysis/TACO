import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ofType, createEffect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { ItemActions, TestbedActions, ToastActions } from '../actions';
import { ItemService } from '../services/item.service';
import { ItemChanges, ItemData, ItemStatus } from '../models';
import { ItemFormDialogComponent } from '../components/item-form-dialog/item-form-dialog.component';
import { AppState } from '../app-store';
import { AuthService } from '../services/auth.service';
import { ToggleOnlineDialogComponent } from '../components';

@Injectable()
export class ItemEffects {
  constructor(
    private actions: Actions,
    private authService: AuthService,
    private itemService: ItemService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) { }

  public createItemData = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createItemData),
      switchMap(({ itemData }) =>
        this.authService.createItemData(
          itemData
        ).pipe(
          switchMap((createdItemData: ItemData) => [
            ItemActions.createItemDataSuccess({
              itemData: createdItemData
            }),
            ToastActions.showToast({
              message: itemData.name + ' was updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.createItemDataFailure({
              error
            }),
            ToastActions.showToast({
              message: itemData.name + ' was not updated',
              toastType: 'error'
            })
          ])
        )
      )
    )
  );

  public deleteItemData = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.deleteItem),
      switchMap(({ itemData }) =>
        this.authService.deleteItemData(
          itemData.id
        ).pipe(
          switchMap((deleted: boolean) => [
            ItemActions.deleteItemSuccess({
              itemId: itemData.id
            }),
            ToastActions.showToast({
              message: itemData.name + ' deleted successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.deleteItemFailure({
              error
            }),
            ToastActions.showToast({
              message: itemData.name + ' was not deleted',
              toastType: 'error'
            })
          ])
        )
      )
    )
  );

  public createItemStatus = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.createItemStatus),
      switchMap(({ itemStatus }) => {
        return this.authService.createItemStatus(
          itemStatus
        ).pipe(
          switchMap((createdItemStatus: ItemStatus) => [
            ItemActions.createItemStatusSuccess({
              itemStatus: createdItemStatus
            }),
            ToastActions.showToast({
              message: createdItemStatus.status + ' was created successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.createItemStatusFailure({
              error
            }),
            ToastActions.showToast({
              message: itemStatus.status + ' was not created',
              toastType: 'error'
            })
          ])
        )
      })
    )
  );

  public getItemChanges = createEffect(() => {
    return this.actions.pipe(
      ofType(TestbedActions.selectTestbed),
      switchMap(({ testbedId }) => {
        if (testbedId) {
          return this.itemService.getHistory(
            testbedId
          ).pipe(
            map(history => ItemActions.setHistory({
              history
            })),
            catchError(
              (error: Error) => [
                ItemActions.fetchItemChangesFailure({
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

  public getItemData = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.getItemData),
      switchMap(({ testbedId }) =>
        this.itemService.getItemData(
          testbedId
        ).pipe(
          map(itemDataMap => ItemActions.setItemDataMap({
            itemDataMap
          })),
          catchError(
            (error: Error) => [
              ItemActions.getItemDataFailure({
                error
              })
            ]
          )
        )
      )
    );
  });

  public saveItemDescription = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.saveItemDescription),
      switchMap(({ description, itemId }) =>
        this.itemService.putItemDescription(
          description,
          itemId
        ).pipe(
          switchMap((savedDescription: string) => [
            ItemActions.updateItemDescriptionSuccess({
              description: savedDescription,
              itemId
            }),
            ToastActions.showToast({
              message: 'Item description updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.updateItemDescriptionFailure({
              error
            }),
            ToastActions.showToast({
              message: 'Item description was not updated',
              toastType: 'error'
            })
          ])
        )
      )
    );
  });

  public toggleOnline = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.toggleOnline),
      switchMap(({ item, username }) => {
        const toggleOnlineDialog = this.dialog.open(ToggleOnlineDialogComponent, {
          width: '30em',
          data: {
            item,
            username
          },
          disableClose: true
        });

        return forkJoin([
          of(item),
          toggleOnlineDialog.afterClosed()
        ]);
      }),
      map(([item, result]) => ({
        item,
        result
      })),
      switchMap(({ item, result }) => {
        if (result) {
          item = {
            ...item
          };

          item.online = !item.online;

          return this.itemService.toggleOnline(
            item
          ).pipe(
            switchMap((itemData: ItemData) => [
              ItemActions.toggleOnlineSuccess({
                itemData
              }),
              ItemActions.CreateItemChanges({
                itemId: itemData.id,
                itemChanges: result
              })
            ]),
            catchError((error: Error) => [
              ItemActions.toggleOnlineFailure({
                error
              })
            ])
          );
        }

        return [];
      })
    )
  );

  public createItemChanges = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.CreateItemChanges),
      switchMap(({ itemId, itemChanges, image }) => {
        const newItemChanges = {
          ...itemChanges
        };

        // Remove properties that are going to be generated on save.
        delete newItemChanges.id;
        delete newItemChanges.updated;

        return this.itemService.createItemChanges(
          itemId,
          newItemChanges
        ).pipe(
          switchMap((createdItemChanges: ItemChanges) => {
            const actions = [];

            actions.push(
              ItemActions.ItemChangesModifySuccess({
                itemChanges: createdItemChanges
              })
            );

            // Only try and save our image if one was uploaded.
            if (image) {
              actions.push(
                ItemActions.SaveImage({
                  itemChangeId: createdItemChanges.id,
                  image
                })
              );
            }

            return actions;
          }),
          catchError((error: HttpErrorResponse) => [
            ItemActions.ItemChangesModifyFailure({
              error
            }),
            ToastActions.showToast({
              message: error.error,
              toastType: 'error'
            })
          ])
        );
      })
    );
  });

  public deleteItemChanges = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.DeleteItemChanges),
      switchMap(({ id }) => {
        return this.authService.deleteItemChanges(
          id
        ).pipe(
          switchMap((deleted: boolean) => [
            ItemActions.DeleteItemChangesSuccess({
              deleted,
              id
            })
          ]),
          catchError((error: Error) => [
            ItemActions.DeleteItemChangesFailure({ error })
          ])
        );
      })
    );
  });

  public fetchSnapshot = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.fetchSnapshot),
      switchMap(({ dateTime, testbedId }) => {
        return this.itemService.getSnapshot(
          dateTime,
          testbedId
        ).pipe(
          switchMap((snapshot: ItemData[]) => [
            ItemActions.fetchSnapshotSuccess({
              snapshot
            })
          ]),
          catchError((error: Error) => [
            ItemActions.fetchSnapshotFailure({
              error
            })
          ])
        );
      })
    );
  });

  public openItemFormDialog = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.openItemFormDialog),
      switchMap(({ dialogData, selectedItemId, editing }) => {
        const itemFormDialog = this.dialog.open(
          ItemFormDialogComponent,
          {
            width: '50em',
            data: dialogData,
            disableClose: true
          }
        );

        return forkJoin([
          of(selectedItemId),
          itemFormDialog.afterClosed(),
          of(editing)
        ]);
      }),
      map(([selectedItemId, result, editing]) => ({
        selectedItemId,
        result,
        editing
      })),
      switchMap(({ selectedItemId, result, editing }) => {
        if (result) {
          if (editing) {
            return [
              ItemActions.updateItemChange({
                itemChange: result.itemChanges
              })
            ];
          } else {
            return [
              // Create our item changes and also save the image if one was uploaded.
              ItemActions.CreateItemChanges({
                itemId: selectedItemId,
                itemChanges: result.itemChanges,
                image: result.image
              })
            ];
          }
        }

        return [];
      })
    );
  });

  public saveImage = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.SaveImage),
      switchMap(({ itemChangeId, image }) => {
        return this.itemService.saveImage(
          itemChangeId,
          image
        ).pipe(
          switchMap(() => [
            ItemActions.saveImageSuccess({
              success: true
            }),
          ]),
          catchError((error: Error) => [
            ItemActions.SaveImageFailure({ error })
          ])
        );
      })
    );
  });

  public toggleImage = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.toggleImage),
      withLatestFrom(this.store),
      map(([action, state]) => ({ action, state })),
      switchMap(({ action, state }) => {
        const { itemChangesId } = action;

        if (itemChangesId === null) {
          // If the itemChangesId is null, hide the currently shown image.
          return [
            ItemActions.hideImage({
              success: true
            })
          ];
        } else if (itemChangesId !== null
          && state.item.images[itemChangesId] !== undefined) {
          // Otherwise, show the image.
          return [
            ItemActions.ShowImage({
              itemChangesId
            })
          ];
        }

        // Otherwise get the image and show it.
        return this.itemService.getImage(
          action.itemChangesId
        ).pipe(
          switchMap((image: Blob) => {
            if (image) {
              return [
                ItemActions.getImageSuccess({
                  image,
                  itemChangesId
                }),
                ItemActions.ShowImage({
                  itemChangesId
                })
              ];
            }

            // If there was a problem finding the image, show a toast.
            return [
              ToastActions.showToast({
                message: 'There was a problem fetching your image',
                toastType: 'warning'
              })
            ];
          }),
          catchError((error: Error) => [
            ItemActions.getImageFailure({
              error
            })
          ])
        );
      })
    );
  });

  public toggleLockItem = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.toggleLockItem),
      switchMap(({ locked, itemId }) => {
        return this.authService.toggleLockItem(
          locked,
          itemId
        ).pipe(
          switchMap((savedLock: boolean) => [
            ItemActions.toggleLockItemSuccess({
              locked: savedLock,
              itemId
            })
          ]),
          catchError((error: Error) => [
            ItemActions.toggleLockItemFailure({
              error
            })
          ])
        );
      })
    )
  );

  public updateItemChange = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.updateItemChange),
      switchMap(({ itemChange }) => {
        return this.authService.updateItemChange(
          itemChange
        ).pipe(
          switchMap((updatedItemChange: ItemChanges) => [
            ItemActions.updateItemChangeSuccess({
              itemChange: updatedItemChange
            }),
            ToastActions.showToast({
              message: 'Item change was updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.updateItemChangeFailure({
              error
            }),
            ToastActions.showToast({
              message: 'Item change was not updated successfully',
              toastType: 'error'
            })
          ])
        );
      })
    )
  );

  public updateItemData = createEffect(() =>
    this.actions.pipe(
      ofType(ItemActions.UpdateItemData),
      switchMap(({ itemData }) => {
        return this.authService.updateItemData(
          itemData
        ).pipe(
          switchMap((updatedItemData: ItemData) => [
            ItemActions.updateItemDataSuccess({
              itemData: updatedItemData
            }),
            ToastActions.showToast({
              message: updatedItemData.name + ' was updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.UpdateItemDataFailure({
              error
            }),
            ToastActions.showToast({
              message: itemData.name + ' was not updated',
              toastType: 'error'
            })
          ])
        );
      })
    )
  );

  public updateItemStatus = createEffect(() => {
    return this.actions.pipe(
      ofType(ItemActions.updateItemStatus),
      switchMap(({ itemStatus }) => {
        return this.authService.updateItemStatus(
          itemStatus
        ).pipe(
          switchMap((updatedItemStatus: ItemStatus) => [
            ItemActions.updateItemStatusSuccess({
              itemStatus: updatedItemStatus
            }),
            ToastActions.showToast({
              message: updatedItemStatus.status + ' was updated successfully',
              toastType: 'success'
            })
          ]),
          catchError((error: Error) => [
            ItemActions.updateItemStatusFailure({
              error
            }),
            ToastActions.showToast({
              message: itemStatus.status + ' was not updated',
              toastType: 'error'
            })
          ])
        );
      })
    );
  });
}

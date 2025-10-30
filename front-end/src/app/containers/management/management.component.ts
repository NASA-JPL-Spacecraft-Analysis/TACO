import { Component, OnDestroy, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { SubSink } from 'subsink';

import { Testbed, ItemData, TestbedSettings, ItemStatus, ItemChanges, NumberTMap, ItemFormDialogData, ItemDataHistory, ItemChangesHistory, TestbedToItemDataMap, ItemDataMap, EntryAction } from '../../models';
import { getItemChangesHistory, getTestbedSettings, getTestbedsAsList, getSelectedTestbedById, getSelectedTestbedItemsAsList, getHistory, getItemStatuses, getItemDataHistory, getItemDataMap, getTestbedToItemDataMap, getHoveredImage } from '../../selectors';
import { ItemDataDialogComponent } from '../../components/item-data-dialog/item-data-dialog.component';
import { ItemActions, ToastActions, TestbedActions } from '../../actions';
import { AppState } from './../../app-store';
import { ConfirmationDialogComponent, ConfirmationDialogTypes, StatusDialogComponent } from 'src/app/components';

enum ManagementViews {
  Changes,
  Component,
  Configuration,
  Statuses,
  ItemChangesHistory,
  ItemDataHistory
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'management',
  templateUrl: 'management.component.html',
  styleUrls: ['management.component.css']
})
export class ManagementComponent implements OnInit, OnDestroy {
  public columnsToDisplay = [
    'id',
    'parentId',
    'parent',
    'name',
    'fullname',
    'online',
    'locked',
    'sortOrder',
    'actions'
  ];
  public hoveredImage: Blob;
  public currentView = ManagementViews.Configuration;
  public items: ItemDataMap;
  public itemChanges: ItemChanges[];
  public itemChangesHistory: ItemChangesHistory[];
  public itemDataHistory: ItemDataHistory[];
  public itemStatuses: NumberTMap<ItemStatus>;
  public managementViews = ManagementViews;
  public title = 'Management';
  public testbeds: Testbed[] = [];
  public testbedSettingsMap: Map<number, TestbedSettings>;
  public testbedToItemDataMap: TestbedToItemDataMap;
  public selectedItemChangesHistory: ItemChangesHistory[];
  public selectedItemDataHistory: ItemDataHistory[];
  public selectedTestbed: Testbed;
  public selectedTestbedItems: ItemData[];

  private subscriptions = new SubSink();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private store: Store<AppState>
  ) {
    this.iconRegistry.addSvgIcon('more_vert', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more_vert.svg'));
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.store.pipe(select(getTestbedToItemDataMap)).subscribe(testbedToItemDataMap => {
        this.testbedToItemDataMap = testbedToItemDataMap;

        this.setItems();

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getHistory)).subscribe(history => {
        this.itemChanges = history;

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getHoveredImage)).subscribe(hoveredImage => {
        this.hoveredImage = hoveredImage;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemChangesHistory)).subscribe(itemChangesHistory => {
        this.itemChangesHistory = itemChangesHistory;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemDataHistory)).subscribe(itemDataHistory => {
        this.itemDataHistory = itemDataHistory;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemStatuses)).subscribe(itemStatuses => {
        this.itemStatuses = itemStatuses;

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbedsAsList)).subscribe(testbeds => {
        this.testbeds = testbeds;

        this.testbeds.sort(
          (firstTestbed, secondTestbed) => {
            if (firstTestbed.sortOrder === secondTestbed.sortOrder) {
              return 0;
            } else if (firstTestbed.sortOrder === null) {
              return 1;
            } else if (secondTestbed.sortOrder === null) {
              return -1;
            }

            return firstTestbed.sortOrder - secondTestbed.sortOrder;
          }
        );

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getSelectedTestbedById)).subscribe(selectedTestbed => {
        this.selectedTestbed = selectedTestbed;

        this.setItems();

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getSelectedTestbedItemsAsList)).subscribe(selectedTestbedItems => {
        this.selectedTestbedItems = selectedTestbedItems;

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbedSettings)).subscribe(testbedSettings => {
        this.testbedSettingsMap = new Map<number, TestbedSettings>();

        for (const testbedSetting of testbedSettings) {
          this.testbedSettingsMap.set(testbedSetting.testbedId, testbedSetting);
        }

        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public changeView(newView: ManagementViews): void {
    this.currentView = newView;
  }

  public onAddStatus(): void {
    this.subscriptions.add(
      this.dialog.open(StatusDialogComponent, {
        width: '50em',
        data: {
          itemStatus: undefined
        },
        disableClose: true
      }).afterClosed().subscribe(
        (result: ItemStatus) => {
          if (result) {
            result.testbedId = this.selectedTestbed.id;

            this.store.dispatch(ItemActions.createItemStatus({
              itemStatus: result
            }));
          }
        }
      )
    );
  }

  public onTestbedSelect(testbedId: number): void {
    this.store.dispatch(TestbedActions.selectTestbed({
      testbedId
    }));

    this.selectedItemChangesHistory = [];

    for (const itemChangesHistoryItem of this.itemChangesHistory) {
      if (this.items[itemChangesHistoryItem.itemId]
        && this.items[itemChangesHistoryItem.itemId].testbedId === testbedId) {
        this.selectedItemChangesHistory.push(itemChangesHistoryItem);
      }
    }

    this.selectedItemDataHistory = this.itemDataHistory.filter((itemDataHistoryItem) => {
      return itemDataHistoryItem.testbedId === testbedId;
    });
  }

  public onStatusOutput(itemStatus: ItemStatus): void {
    this.store.dispatch(ItemActions.updateItemStatus({
      itemStatus
    }));
  }

  public onSortOrderSave(sortOrder: number): void {
    this.store.dispatch(TestbedActions.updateSortOrder({
      sortOrder,
      testbedId: this.selectedTestbed.id
    }));
  }

  public onTestbedSettingsSave(testbedSettings: TestbedSettings): void {
    this.store.dispatch(TestbedActions.updateTestbedSettings({
      testbedSettings
    }));
  }

  public onDeleteItem(itemData: ItemData): void {
    // We don't want to allow admins to delete parents.
    if (this.isItemParent(itemData.id)) {
      this.store.dispatch(ToastActions.showToast({
        message: 'You cannot delete a parent item',
        toastType: 'error'
      }));
    } else {
      this.subscriptions.add(
        this.dialog.open(ConfirmationDialogComponent, {
          width: '30em',
          data: {
            itemData,
            type: ConfirmationDialogTypes.Delete
          },
          disableClose: true
        }).afterClosed().subscribe(
          (result: boolean) => {
            if (result) {
              this.store.dispatch(ItemActions.deleteItem({
                itemData
              }));
            }
          }
        )
      );
    }
  }

  public onEditItem(entryAction: EntryAction): void {
    switch (entryAction.type) {
      case 'delete':
        this.store.dispatch(ItemActions.DeleteItemChanges({
          id: entryAction.changes.id
        }));

        break;
      case 'edit':
        const dialogData: ItemFormDialogData = {
          changes: entryAction.changes,
          itemStatuses: this.itemStatuses,
          editing: true
        };

        this.store.dispatch(ItemActions.openItemFormDialog({
          selectedItemId: entryAction.changes.itemId,
          dialogData,
          editing: true
        }));

        break;
    }
  }

  public onLockItem(itemData: ItemData): void {
    this.subscriptions.add(
      this.dialog.open(ConfirmationDialogComponent, {
        width: '30em',
        data: {
          itemData,
          type: ConfirmationDialogTypes.Lock
        },
        disableClose: true
      }).afterClosed().subscribe(
        (result: boolean) => {
          if (result) {
            this.store.dispatch(ItemActions.toggleLockItem({
              locked: !itemData.locked,
              itemId: itemData.id
            }));
          }
        }
      )
    );
  }

  public onModifyItem(itemData?: ItemData): void {
    // Admin is adding a new item.
    if (itemData === undefined) {
      this.subscriptions.add(
        this.dialog.open(ItemDataDialogComponent, {
          width: '50em',
          data: {
            itemData,
            testbedItemList: this.selectedTestbedItems
          },
          disableClose: true
        }).afterClosed().subscribe(
          (result: ItemData) => {
            if (result) {
              result.testbedId = this.selectedTestbed.id;

              this.store.dispatch(ItemActions.createItemData({
                itemData: result
              }));
            }
          }
        )
      );
    } else {
      const filteredItems: ItemData[] = [];
      const parentMap: Map<number, boolean> = new Map();

      // Filter out the current item we're looking at, and any of its children so we can't select them as parents.
      for (const item of this.selectedTestbedItems) {
        if (item.id === itemData.id || parentMap.get(item.parentId)) {
          parentMap.set(item.id, true);
        }

        if (!parentMap.get(item.id)) {
          filteredItems.push(item);
        }
      }

      // Admin is modifying an existing item.
      this.subscriptions.add(
        this.dialog.open(ItemDataDialogComponent, {
          width: '50em',
          data: {
            itemData,
            testbedItemList: filteredItems
          },
          disableClose: true
        }).afterClosed().subscribe(
          (result: ItemData) => {
            if (result && (result.name !== itemData.name
              || result.fullname !== itemData.fullname
              || result.sortOrder !== itemData.sortOrder
              || result.parentId !== itemData.parentId)) {
              // Clone fields before posting so we can save a history of the changes.
              result = {
                ...itemData,
                name: result.name,
                fullname: result.fullname,
                sortOrder: result.sortOrder,
                parentId: result.parentId
              };

              // Only update if the user has actually made a change.
              this.store.dispatch(ItemActions.UpdateItemData({
                itemData: result
              }));
            }
          }
        )
      );
    }
  }

  public toggleShowImage(itemChangesId: number): void {
    this.store.dispatch(ItemActions.toggleImage({
      itemChangesId
    }));
  }

  private isItemParent(itemId: number): boolean {
    for (const item of this.selectedTestbedItems) {
      if (item.parentId === itemId) {
        return true;
      }
    }

    return false;
  }

  private setItems(): void {
    if (this.selectedTestbed && this.testbedToItemDataMap) {
      this.items = this.testbedToItemDataMap[this.selectedTestbed.id];
    }
  }
}

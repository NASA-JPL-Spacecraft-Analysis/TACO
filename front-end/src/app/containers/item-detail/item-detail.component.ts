import { Component, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { SubSink } from 'subsink';

import { ItemChanges, ItemData, Testbed, EntryAction, NumberTMap, ItemStatus, ItemFormDialogData } from '../../models';
import {
  getItemChanges,
  getSelectedItem,
  getItemStatuses,
  getTestbeds,
  getUsername,
  getCanEdit,
  getHoveredImage,
  getUserCanEdit
} from '../../selectors';
import { ItemActions } from '../../actions';
import { AppState } from './../../app-store';
import { DescriptionDialogComponent } from 'src/app/components';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'item-detail',
  templateUrl: 'item-detail.component.html',
  styleUrls: ['item-detail.component.css']
})
export class ItemDetailComponent implements OnDestroy, OnInit {
  public hoveredImage: Blob;
  public itemChanges: ItemChanges[];
  public itemStatuses: NumberTMap<ItemStatus>;
  public selectedItem: ItemData;
  public canEdit: boolean;
  public testbeds: NumberTMap<Testbed>;
  public username: string;
  public userCanEdit: boolean;

  private openDialog: MatDialogRef<DescriptionDialogComponent>;
  private subscriptions = new SubSink();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.subscriptions.add(
      this.store.pipe(select(getUserCanEdit)).subscribe(userCanEdit => {
        this.userCanEdit = userCanEdit;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemChanges)).subscribe(itemChanges => {
        this.itemChanges = itemChanges;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getItemStatuses)).subscribe(itemStatuses => {
        this.itemStatuses = itemStatuses;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getHoveredImage)).subscribe(hoveredImage => {
        this.hoveredImage = hoveredImage;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getSelectedItem)).subscribe(selectedItem => {
        this.selectedItem = selectedItem;

        // Update the open dialog's item to update the saved description.
        if (this.openDialog) {
          this.openDialog.componentInstance.data = this.selectedItem;
        }

        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getCanEdit)).subscribe(canEdit => {
        this.canEdit = canEdit;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getTestbeds)).subscribe(testbeds => {
        this.testbeds = testbeds;
        this.changeDetectorRef.markForCheck();
      }),
      this.store.pipe(select(getUsername)).subscribe(username => {
        this.username = username;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnInit(): void {
    this.selectedItem = null;
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public onDescriptionClick(): void {
    this.openDialog = this.dialog.open(DescriptionDialogComponent, {
      width: '50em',
      data: this.selectedItem,
      disableClose: true
    });

    this.subscriptions.add(
      this.openDialog.componentInstance.saveOutput.subscribe((description: string) => {
        this.store.dispatch(ItemActions.saveItemDescription({
          description,
          itemId: this.selectedItem.id
        }));
      })
    );
  }

  public onOpenItemDataDialog(itemChanges: ItemChanges, editing: boolean): void {
    const dialogData: ItemFormDialogData = {
      changes: itemChanges,
      itemStatuses: this.itemStatuses,
      editing
    };

    this.store.dispatch(ItemActions.openItemFormDialog({
      selectedItemId: this.selectedItem.id,
      dialogData,
      editing
    }));
  }

  public handleEntryAction(action: EntryAction): void {
    // leaves setup ready for possible future action implementations
    switch (action.type) {
      case 'copy':
        this.onOpenItemDataDialog(action.changes, false);

        break;
      case 'delete':
        this.store.dispatch(ItemActions.DeleteItemChanges({
          id: action.changes.id
        }));

        break;
      case 'edit':
        this.onOpenItemDataDialog(action.changes, true);

        break;
    }
  }

  public toggleShowImage(itemChangesId: number): void {
    this.store.dispatch(ItemActions.toggleImage({
      itemChangesId
    }));
  }
}

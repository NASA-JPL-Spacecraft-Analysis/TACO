import { NgModule, Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ItemData } from 'src/app/models';
import { MaterialModule } from 'src/app/material';

export enum ConfirmationDialogTypes {
  Delete,
  Lock
}

interface ConfirmationDialogData {
  itemData: ItemData;
  type: ConfirmationDialogTypes;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.component.html',
  styleUrls: [ 'confirmation-dialog.component.css' ]
})
export class ConfirmationDialogComponent implements OnInit {
  public content: string;
  public title: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  public ngOnInit(): void {
    this.content = 'Are you sure you would like to ';

    switch (this.data.type) {
      case ConfirmationDialogTypes.Delete:
        this.title = 'Delete';
        this.content += 'delete';

        break;

      case ConfirmationDialogTypes.Lock:
        if (this.data.itemData.locked) {
          this.title = 'Unlock';
          this.content += 'unlock';
        } else {
          this.title = 'Lock';
          this.content += 'lock';
        }

        break;
    }

    this.title += ' Item';
    this.content += ' ' + this.data.itemData.fullname + '?';
  }

  public onSubmit(): void {
    this.dialogRef.close(true);
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }
}

@NgModule({
  declarations: [
    ConfirmationDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ConfirmationDialogModule {}

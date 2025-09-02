import { Component, ChangeDetectionStrategy, NgModule, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ItemChanges, ItemData } from 'src/app/models';
import { MaterialModule } from 'src/app/material';

interface ToggleOnlineDialogData {
  item: ItemData;
  username: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'toggle-online-dialog',
  styleUrls: [ 'toggle-online-dialog.component.css' ],
  templateUrl: 'toggle-online-dialog.component.html'
})
export class ToggleOnlineDialogComponent implements OnInit {
  public form: FormGroup;
  public title: string;

  private itemChanges: ItemChanges;

  constructor(
    public dialogRef: MatDialogRef<ToggleOnlineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ToggleOnlineDialogData,
    private formBuilder: FormBuilder,
  ) {}

  public ngOnInit(): void {
    let rationaleText = 'This item went ';

    // Item is online, so the user is turning it off.
    if (this.data.item.online) {
      rationaleText += 'offline';
      this.title = 'Offlining ';
    } else {
      rationaleText += 'online';
      this.title = 'Onlining ';
    }

    this.title += this.data.item.name;

    // Create a history event for a container online toggle.
    this.itemChanges = {
      id: null,
      itemId: this.data.item.id,
      status: null,
      description: '',
      version: '',
      serialNumber: '',
      partNumber: '',
      username: this.data.username || '', // Use an empty string for the username when running username is null.
      updated: '',
      rationale: rationaleText,
      image: null
    };

    this.form = this.formBuilder.group({
      rationale: new FormControl(this.itemChanges.rationale, [ Validators.required ])
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSubmit(value: ItemChanges): void {
    this.itemChanges.rationale = value.rationale;

    this.dialogRef.close(this.itemChanges);
  }
}

@NgModule({
  declarations: [
    ToggleOnlineDialogComponent
  ],
  exports: [
    ToggleOnlineDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ToggleOnlineDialogModule {}

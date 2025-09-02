import { Component, OnInit, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ItemStatus } from '../../models';

@Component({
  selector: 'status-dialog',
  styleUrls: [ 'status-dialog.component.css' ],
  templateUrl: 'status-dialog.component.html',
})
export class StatusDialogComponent implements OnInit {
  public form: FormGroup;
  public title: string;

  constructor(
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public status: ItemStatus,
    private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    if (!this.status) {
      this.title = 'Add';

      this.status = {
        id: undefined,
        color: '',
        sortOrder: undefined,
        status: '',
        testbedId: undefined
      };
    } else {
      this.title = 'Edit';
    }

    this.title += ' Item Status'

    this.form = this.formBuilder.group({
      color: new FormControl(this.status.color, [ Validators.required ]),
      sortOrder: new FormControl(this.status.sortOrder),
      status: new FormControl(this.status.status, [ Validators.required ])
    });
  }

  public onSubmit(updatedStatus: ItemStatus): void {
    if (this.form.valid) {
      updatedStatus = {
        ...this.status,
        ...updatedStatus
      };

      this.dialogRef.close(updatedStatus);
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}

@NgModule({
  declarations: [
    StatusDialogComponent
  ],
  exports: [
    StatusDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class StatusDialogModule {}

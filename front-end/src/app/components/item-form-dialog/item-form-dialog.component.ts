import { Component, ChangeDetectionStrategy, Inject, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isEqual } from 'lodash';

import { ItemChanges, NumberTMap, ItemStatus, ItemFormDialogData } from '../../models';
import { ValidationService } from '../../services/validation.service';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'item-form-dialog',
  templateUrl: 'item-form-dialog.component.html',
  styleUrls: [ 'item-form-dialog.component.css' ]
})
export class ItemFormDialogComponent implements OnInit {
  public changes: ItemChanges;
  public itemStatuses: NumberTMap<ItemStatus>;
  public form: FormGroup;

  private image: File;

  constructor(
    private formBuilder: FormBuilder,
    private validationService: ValidationService,
    public dialogRef: MatDialogRef<ItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemFormDialogData
  ) {}

  public ngOnInit(): void {
    this.changes = this.data.changes;
    this.itemStatuses = this.data.itemStatuses;
    let changes: Partial<ItemChanges>;

    if (this.changes) {
      changes = {
        ...this.changes
      };

      if (changes.status === null) {
        changes.status = StateTrackerConstants.NOT_PRESENT_STATUS_ID;
      }
    } else {
      changes = {
        status: null,
        description: '',
        version: '',
        serialNumber: '',
        partNumber: '',
        username: '',
        rationale: '',
        image: null
      };
    }

    this.form = this.formBuilder.group({
      status: new FormControl(this.validationService.numberOrNull(changes.status), [ Validators.required ]),
      description: new FormControl(changes.description),
      version: new FormControl(changes.version, [ Validators.required ]),
      serialNumber: new FormControl(changes.serialNumber, [ Validators.required ]),
      partNumber: new FormControl(changes.partNumber, [ Validators.required ]),
      username: new FormControl(changes.username, [ Validators.required ]),
      rationale: new FormControl('', [ Validators.required ]),
    });

    // in the case that "Not Present/Absent" was previously selected
    this.possiblyDisableFields();
  }

  public onStatusChange(event: MatSelectChange): void {
    const { value } = this.form;

    // Check if "Not Present/Absent" is selected.
    if (!event.value || event.value === StateTrackerConstants.NOT_PRESENT_STATUS_ID) {
      this.form = this.formBuilder.group({
        status: new FormControl(value.status, [ Validators.required ]),
        description: new FormControl(value.description, [ Validators.required ]),
        version: new FormControl({ value: '', disabled: true }),
        serialNumber: new FormControl({ value: '', disabled: true }),
        partNumber: new FormControl({ value: '', disabled: true }),
        username: new FormControl(value.username, [ Validators.required ]),
        rationale: new FormControl(value.rationale, [ Validators.required ]),
      });
    } else {
      this.form = this.formBuilder.group({
        status: new FormControl(this.validationService.numberOrNull(value.status), [ Validators.required ]),
        description: new FormControl(value.description),
        version: new FormControl(value.version, [ Validators.required ]),
        serialNumber: new FormControl(value.serialNumber, [ Validators.required ]),
        partNumber: new FormControl(value.partNumber, [ Validators.required ]),
        username: new FormControl(value.username, [ Validators.required ]),
        rationale: new FormControl(value.rationale, [ Validators.required ]),
      });
    }

    this.addEditingFields();
  }

  public onSubmit(value: ItemChanges): void {
    if (this.form.valid) {
      // Use the export type to compare, but also remove the updated property.
      const itemChangesCopy = {
        ...this.changes
      };

      delete itemChangesCopy.id;
      delete itemChangesCopy.itemId;
      delete itemChangesCopy.updated;

      value.image = this.image !== null && this.image !== undefined;

      // Return undefined if there weren't any changes to the item so we don't save.
      let itemChanges = isEqual(value, itemChangesCopy)
        ? undefined
        : value;

      if (itemChanges) {
        itemChanges = {
          ...itemChanges,
          id: this.changes.id
        };
      }

      this.dialogRef.close({ itemChanges, image: this.image });
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onFileUpload(uploadedFile: File): void {
    this.image = uploadedFile;
  }

  /**
   * TODO: This is no longer working, the user should be notified when they press escape or if they cancel with
   * unsaved changes.
   * @param $event
   */
  @HostListener('window:beforeunload', ['$event'])
  public unloadNotification($event: BeforeUnloadEvent): void {
    if (!this.form.pristine) {
      $event.returnValue = true;
    }
  }

  /**
   * Close the dialog when the escape key is pressed.
   * @param $event
   */
  @HostListener('document:keydown', ['$event'])
  public handleKeyEvent($event: KeyboardEvent): void {
    const { key } = $event;

    if (key && (key === 'Escape' || key === 'Esc')) {
      this.onCancel();
    }
  }

  private addEditingFields(): void {
    // Only set rationale if the change is being edited.
    if (this.data.editing) {
      this.form.addControl('id', new FormControl(this.changes.id));
      this.form.addControl('itemId', new FormControl(this.changes.itemId));
      this.form.addControl('updated', new FormControl(this.changes.updated));
      this.form.controls['rationale'].setValue(this.changes.rationale);
    }
  }

  private possiblyDisableFields(): void {
    if (this.changes &&
      (Number(this.changes.status) === StateTrackerConstants.NOT_PRESENT_STATUS_ID)
      || (this.changes.status === null)) {
      const currentUsername = this.form.value.username;

      const newForm = this.formBuilder.group({
        status: new FormControl(this.form.value.status, [ Validators.required ]),
        description: new FormControl(this.form.value.description, [ Validators.required ]),
        version: new FormControl({ value: '', disabled: true }),
        serialNumber: new FormControl({ value: '', disabled: true }),
        partNumber: new FormControl({ value: '', disabled: true }),
        username: new FormControl(currentUsername, [ Validators.required ]),
        rationale: new FormControl(this.form.value.rationale, [ Validators.required ])
      });

      this.form = newForm;
    }

    this.addEditingFields();
  }
}

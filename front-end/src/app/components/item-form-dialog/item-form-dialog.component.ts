import { Component, ChangeDetectionStrategy, Inject, HostListener, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
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
  public form: UntypedFormGroup;

  private image: File;

  constructor(
    private formBuilder: UntypedFormBuilder,
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
      status: new UntypedFormControl(this.validationService.numberOrNull(changes.status), [ Validators.required ]),
      description: new UntypedFormControl(changes.description),
      version: new UntypedFormControl(changes.version, [ Validators.required ]),
      serialNumber: new UntypedFormControl(changes.serialNumber, [ Validators.required ]),
      partNumber: new UntypedFormControl(changes.partNumber, [ Validators.required ]),
      username: new UntypedFormControl(changes.username, [ Validators.required ]),
      rationale: new UntypedFormControl('', [ Validators.required ]),
    });

    // in the case that "Not Present/Absent" was previously selected
    this.possiblyDisableFields();
  }

  public onStatusChange(event: MatSelectChange): void {
    const { value } = this.form;

    // Check if "Not Present/Absent" is selected.
    if (!event.value || event.value === StateTrackerConstants.NOT_PRESENT_STATUS_ID) {
      this.form = this.formBuilder.group({
        status: new UntypedFormControl(value.status, [ Validators.required ]),
        description: new UntypedFormControl(value.description, [ Validators.required ]),
        version: new UntypedFormControl({ value: '', disabled: true }),
        serialNumber: new UntypedFormControl({ value: '', disabled: true }),
        partNumber: new UntypedFormControl({ value: '', disabled: true }),
        username: new UntypedFormControl(value.username, [ Validators.required ]),
        rationale: new UntypedFormControl(value.rationale, [ Validators.required ]),
      });
    } else {
      this.form = this.formBuilder.group({
        status: new UntypedFormControl(this.validationService.numberOrNull(value.status), [ Validators.required ]),
        description: new UntypedFormControl(value.description),
        version: new UntypedFormControl(value.version, [ Validators.required ]),
        serialNumber: new UntypedFormControl(value.serialNumber, [ Validators.required ]),
        partNumber: new UntypedFormControl(value.partNumber, [ Validators.required ]),
        username: new UntypedFormControl(value.username, [ Validators.required ]),
        rationale: new UntypedFormControl(value.rationale, [ Validators.required ]),
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
      this.form.addControl('id', new UntypedFormControl(this.changes.id));
      this.form.addControl('itemId', new UntypedFormControl(this.changes.itemId));
      this.form.addControl('updated', new UntypedFormControl(this.changes.updated));
      this.form.controls['rationale'].setValue(this.changes.rationale);
    }
  }

  private possiblyDisableFields(): void {
    if (this.changes &&
      (Number(this.changes.status) === StateTrackerConstants.NOT_PRESENT_STATUS_ID)
      || (this.changes.status === null)) {
      const currentUsername = this.form.value.username;

      const newForm = this.formBuilder.group({
        status: new UntypedFormControl(this.form.value.status, [ Validators.required ]),
        description: new UntypedFormControl(this.form.value.description, [ Validators.required ]),
        version: new UntypedFormControl({ value: '', disabled: true }),
        serialNumber: new UntypedFormControl({ value: '', disabled: true }),
        partNumber: new UntypedFormControl({ value: '', disabled: true }),
        username: new UntypedFormControl(currentUsername, [ Validators.required ]),
        rationale: new UntypedFormControl(this.form.value.rationale, [ Validators.required ])
      });

      this.form = newForm;
    }

    this.addEditingFields();
  }
}

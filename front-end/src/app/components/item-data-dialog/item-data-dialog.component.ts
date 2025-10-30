import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ItemData } from '../../models';

export class ItemDataDialogData {
  public itemData: ItemData;
  public testbedItemList: ItemData[];
}

@Component({
  selector: 'item-data-dialog',
  templateUrl: 'item-data-dialog.component.html',
  styleUrls: [ 'item-data-dialog.component.css' ]
})
export class ItemDataDialogComponent implements OnInit {
  public form: UntypedFormGroup;
  public itemData: ItemData;
  public testbedItemList: ItemData[];
  public title: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<ItemDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDataDialogData
  ) {}

  public ngOnInit(): void {
    this.itemData = this.data.itemData;
    this.testbedItemList = this.data.testbedItemList;

    if (!this.itemData) {
      this.title = 'New Component';

      this.form = this.formBuilder.group({
        name: new UntypedFormControl('', [ Validators.required ]),
        fullname: new UntypedFormControl('', [ Validators.required ]),
        sortOrder: new UntypedFormControl(),
        parentId: new UntypedFormControl()
      });
    } else {
      this.title = 'Modify Component';

      this.form = this.formBuilder.group({
        name: new UntypedFormControl(this.itemData.name, [ Validators.required ]),
        fullname: new UntypedFormControl(this.itemData.fullname, [ Validators.required ]),
        sortOrder: new UntypedFormControl(this.itemData.sortOrder),
        parentId: new UntypedFormControl(this.itemData.parentId)
      });
    }
  }

  public onSubmit(itemData: ItemData): void {
    this.dialogRef.close(itemData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}

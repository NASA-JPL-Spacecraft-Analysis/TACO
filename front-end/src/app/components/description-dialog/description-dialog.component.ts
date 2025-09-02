import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, NgModule, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material';

import { ItemData, Testbed } from 'src/app/models';
import { CustomPipesModule } from 'src/app/pipes/customPipes.module';

@Component({
  selector: 'description-dialog',
  styleUrls: [ 'description-dialog.component.css' ],
  templateUrl: 'description-dialog.component.html'
})
export class DescriptionDialogComponent implements OnInit {
  @Output() public saveOutput: EventEmitter<string>;

  public editing: boolean;
  public form: FormGroup;
  public title: string;

  constructor(
    public dialogRef: MatDialogRef<DescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Testbed | ItemData,
    private formBuilder: FormBuilder
  ) {
    this.saveOutput = new EventEmitter<string>();

    // If the item has the acronym property, we know it's a testbed.
    if (this.data.hasOwnProperty('acronym')) {
      this.title = 'Testbed';
    } else {
      this.title = 'Item';
    }
  }

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      description: new FormControl(this.data.description)
    });

    // Default editing to true if there isn't a description.
    if (!this.data.description || this.data.description === '') {
      this.editing = true;
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onStartEdit(): void {
    this.editing = true;
  }

  public onSubmit(description: string): void {
    this.saveOutput.emit(description);

    // If the user clears the description and saves it, leave the dialog in editing mode.
    if (description) {
      this.editing = false;
    }
  }
}

@NgModule({
  declarations: [
    DescriptionDialogComponent
  ],
  exports: [
    DescriptionDialogComponent
  ],
  imports: [
    CommonModule,
    CustomPipesModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class DescriptionDialogModule {}

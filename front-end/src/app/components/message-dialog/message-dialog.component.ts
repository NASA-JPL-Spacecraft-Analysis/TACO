import { Input, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.component.html',
  styleUrls: [ 'message-dialog.component.css' ]
})
export class MessageDialogComponent {
  @Input() public name: string;
  @Input() public message: string;

  constructor(private dialogRef: MatDialogRef<MessageDialogComponent>) {}

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onOk(): void {
    this.dialogRef.close(true);
  }
}

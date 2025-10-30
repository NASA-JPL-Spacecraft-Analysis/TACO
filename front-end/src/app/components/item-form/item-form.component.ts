import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { ItemChanges, NumberTMap, ItemStatus } from '../../models';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'item-form',
  templateUrl: 'item-form.component.html',
  styleUrls: ['item-form.component.css']
})
export class ItemFormComponent {
  @Input() public latestChange: ItemChanges;
  @Input() public itemStatuses: NumberTMap<ItemStatus>;
  @Input() public canEdit: boolean;
  @Input() public username: string;

  @Output() public openItemDataDialog: EventEmitter<ItemChanges>;
  @Output() public isFormDirty: EventEmitter<UntypedFormGroup>;

  constructor() {
    this.openItemDataDialog = new EventEmitter<ItemChanges>();
    this.isFormDirty = new EventEmitter<UntypedFormGroup>();
  }

  public openDialog(): void {
    this.latestChange = {
      ...this.latestChange,
      username: this.username
    };

    this.openItemDataDialog.emit(this.latestChange);
  }
}

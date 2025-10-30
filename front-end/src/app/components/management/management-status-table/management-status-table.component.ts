import { Component, ChangeDetectionStrategy, NgModule, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';

import { StateTrackerConstants } from '../../../consts/StateTrackerConstants';
import { ItemStatus, NumberTMap } from 'src/app/models';
import { MaterialModule } from 'src/app/material';
import { StatusDialogComponent, StatusDialogModule } from '../../status-dialog/status-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'management-status-table',
  styleUrls: [ 'management-status-table.component.css' ],
  templateUrl: 'management-status-table.component.html'
})
export class ManagementStatusTableComponent implements OnChanges {
  @Input() public statuses: NumberTMap<ItemStatus>;
  @Input() public testbedName: string;

  @Output() public statusOutput: EventEmitter<ItemStatus>;

  public statusList: ItemStatus[];
  public columnsToDisplay = [
    'id',
    'status',
    'color',
    'sortOrder',
    'actions'
  ];

  constructor(private dialog: MatDialog,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('more_vert', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more_vert.svg'));

    this.statusOutput = new EventEmitter<ItemStatus>();
  }

  public ngOnChanges(): void {
    this.statusList = [];


    for (const key of Object.keys(this.statuses)) {
      // Don't include our default Not Present / Absent status.
      if (this.statuses[key].id !== StateTrackerConstants.NOT_PRESENT_STATUS_ID) {
        this.statusList.push(this.statuses[key]);
      }
    }
  }

  public editStatus(status: ItemStatus): void {
    const dialog = this.dialog.open(StatusDialogComponent, {
      width: '50em',
      data: status,
      disableClose: true
    });

    dialog.afterClosed().subscribe(
      (result: ItemStatus) => {
        // Only emit if the status actually changed.
        if (result
          && (result.status !== status.status
          || result.color !== status.color
          || result.sortOrder !== status.sortOrder)) {
          this.statusOutput.emit(result);
        }
      }
    );
  }
}

@NgModule({
  declarations: [
    ManagementStatusTableComponent
  ],
  exports: [
    ManagementStatusTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    StatusDialogModule
  ]
})
export class ManagementStatusTableModule {}

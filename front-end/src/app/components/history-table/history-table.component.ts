import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ItemChanges, ItemData, EntryAction, NumberTMap, ItemStatus } from '../../models';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'history-table',
  templateUrl: 'history-table.component.html',
  styleUrls: ['history-table.component.css']
})
export class HistoryTableComponent implements OnInit, OnChanges {
  @Input() public adminAction: boolean;
  @Input() public canEdit: boolean;
  @Input() public itemChanges: ItemChanges[];
  @Input() public itemStatuses: NumberTMap<ItemStatus>;
  @Input() public items: ItemData[];
  @Input() public username: string;
  @Input() public showActions = false;
  @Input() public hoveredImage: Blob;

  @Output() public entryActions: EventEmitter<EntryAction>;
  @Output() public showImage: EventEmitter<number>;

  public dataSource: MatTableDataSource<ItemChanges>;
  public imageSrc: SafeResourceUrl;

  public columnsToDisplay = [
    'description',
    'status',
    'version',
    'serialNumber',
    'partNumber',
    'username',
    'rationale',
    'updated',
    'image'
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.iconRegistry.addSvgIcon(
      'more_vert',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more_vert.svg')
    );
    this.iconRegistry.addSvgIcon(
      'image',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/image.svg')
    );

    this.entryActions = new EventEmitter<EntryAction>();
    this.showImage = new EventEmitter<number>();
  }

  public ngOnInit(): void {
    if (this.showActions && this.canEdit) {
      this.columnsToDisplay.push('actions');
    }
  }

  public ngOnChanges(): void {
    if (this.items !== undefined && !this.columnsToDisplay.includes('name')) {
      this.columnsToDisplay.unshift('name');
    }

    this.itemChanges = [...this.itemChanges];

    // Refresh our datasource when we get a new item changes list.
    this.dataSource = new MatTableDataSource(this.itemChanges);

    if (this.hoveredImage) {
      const fileReader = new FileReader();

      fileReader.onload = (e: ProgressEvent) => {
        this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
          (e.target as FileReader).result as string
        );
      };

      fileReader.readAsDataURL(this.hoveredImage);
    } else {
      this.imageSrc = undefined;
    }
  }

  public onItemNavigate(itemId: string): void {
    let url = '../item/' + itemId;

    // If we're on the admin page the url structure is different, so change the URL.
    const keys = Object.keys(this.items);

    if (this.adminAction && keys.length > 0) {
      url = '../testbed/' + this.items[keys[0]].testbedId + '/item/' + itemId;
    }

    this.router.navigate([url], { relativeTo: this.activateRoute });
  }

  public getName(item: ItemData): string {
    if (!item) {
      return '';
    }

    return item.fullname ? item.fullname : item.name;
  }

  public getStatus(itemChanges: ItemChanges): string {
    if (
      this.itemStatuses &&
      itemChanges &&
      itemChanges.status &&
      this.itemStatuses[itemChanges.status]
    ) {
      return this.itemStatuses[itemChanges.status].status;
    }

    // If the item doesn't have a status, then it is Not Present/Absent.
    return StateTrackerConstants.NOT_PRESENT_TEXT;
  }

  public copyToEntry(changes: ItemChanges): void {
    const changesCopy = {
      ...changes
    };

    // Clear our some fields when the user copies a change.
    changesCopy.rationale = '';
    changesCopy.image = false;

    changesCopy.username = this.username;

    this.entryActions.emit({
      type: 'copy',
      changes: changesCopy
    });
  }

  public editEntry(changes: ItemChanges): void {
    this.entryActions.emit({
      type: 'edit',
      changes
    });
  }

  public deleteEntry(changes: ItemChanges): void {
    this.entryActions.emit({
      type: 'delete',
      changes
    });
  }

  public onImageClick(): void {
    const blob = new Blob([this.hoveredImage], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);

    window.open(url);
  }

  public toggleShowImage(itemChangesId: number): void {
    this.showImage.emit(itemChangesId);
  }
}

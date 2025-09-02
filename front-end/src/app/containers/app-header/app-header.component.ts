import { Component, Input, ChangeDetectionStrategy, OnChanges, HostListener, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { MatIconRegistry } from '@angular/material/icon';
import { SubSink } from 'subsink';

import { Testbed, NumberTMap } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { getIsAdmin } from '../../selectors';
import { AppState } from '../../app-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: [ 'app-header.component.css' ]
})
export class AppHeaderComponent implements OnChanges, OnDestroy {
  @Input() public recentlyChangedDays: number;
  @Input() public showVizActions: boolean;
  @Input() public testbeds: NumberTMap<Testbed>;
  @Input() public title: string;

  @Output() public descriptionClick: EventEmitter<boolean>;
  @Output() public presentationClick: EventEmitter<boolean>;
  @Output() public sliderChange: EventEmitter<number>;

  public testbedList: Testbed[] = [];
  public headerText: string;
  public isSticky: boolean;
  public currentTestbed: Testbed;
  public isAdmin: boolean;
  public maxRecentlyChangedValue = 120;

  private subscriptions = new SubSink();

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute,
              private store: Store<AppState>,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef) {
    this.updateTestbedName();

    this.descriptionClick = new EventEmitter<boolean>();
    this.presentationClick = new EventEmitter<boolean>();
    this.sliderChange = new EventEmitter<number>();

    this.iconRegistry.addSvgIcon('add', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add.svg'));
    this.iconRegistry.addSvgIcon('more_vert', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/more_vert.svg'));

    this.subscriptions.add(
      this.store.pipe(select(getIsAdmin)).subscribe(isAdmin => {
        this.isAdmin = isAdmin;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public ngOnChanges(): void {
    this.testbedList = [];

    const { testbedId } = this.activatedRoute.snapshot.paramMap['params'];
    this.currentTestbed = this.testbeds[testbedId];

    this.updateTestbedName();

    if (this.testbeds) {
      const testbedKeys = Object.keys(this.testbeds);

      // Convert our keyBy'd testbeds into a normal list.
      for (const key of testbedKeys) {
        this.testbedList.push(this.testbeds[key]);
      }
    }

    this.testbedList.sort(
      (firstTestbed, secondTestbed) => {
        if (firstTestbed.sortOrder === secondTestbed.sortOrder) {
          return 0;
        } else if (firstTestbed.sortOrder === null) {
          return 1;
        } else if (secondTestbed.sortOrder === null) {
          return -1;
        }

        return firstTestbed.sortOrder - secondTestbed.sortOrder;
      }
    );
  }

  // If we're scrolled past the top of the page, add the box shadow.
  @HostListener('window:scroll', ['$event'])
  public onWindowScroll(): void {
    this.isSticky = document.documentElement.scrollTop > 0;
  }

  // Custom route check because activatedRoute has issues with dynamic urls.
  public checkRoute(url: string): boolean {
    return url === this.router.url;
  }

  public onDescriptionClick(): void {
    this.descriptionClick.emit(true);
  }

  public onPresentationClick(): void {
    this.presentationClick.emit(true);
  }

  public onSliderChange(value: number): void {
    this.sliderChange.emit(value);
  }

  private updateTestbedName(): void {
    // If a title was passed, take that as the priority.
    if (this.title) {
      this.headerText = this.title;
    } else if (this.currentTestbed) {
      this.headerText = this.currentTestbed.acronym + ' - ' + this.currentTestbed.name;
    } else {
      // If we have no root item, the user is uploading a new testbed.
      this.headerText = 'New Testbed';
    }
  }
}

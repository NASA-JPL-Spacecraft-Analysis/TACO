import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

import * as moment from 'moment';

import { DateFilter } from '../../models';
import { StateTrackerConstants } from '../../consts/StateTrackerConstants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'date-time-picker',
  templateUrl: 'date-time-picker.component.html',
  styleUrls: [ 'date-time-picker.component.css' ]
})
export class DateTimePickerComponent implements OnInit {
  @Input() public filterDate: string;
  @Input() public filterTime: string;
  @Input() public labelText: string;
  // The earliest item that is in our history list.
  @Input() public minDate: Date;
  // Used on the snapshot page so we only have an end date filter.
  @Input() public endDateOnly: boolean;

  @Output() public filter: EventEmitter<DateFilter> = new EventEmitter<DateFilter>();

  // Don't let the user select a date past today.
  public maxDate: Date;

  private readonly DEFAULT_TIME = '00:00';

  // The values we're emitting
  public startDate: Date;
  public startTime = this.DEFAULT_TIME;
  public endDate: Date;
  public endTime = this.DEFAULT_TIME;
  public endDateTooltip = 'End Date';
  public endTimeTooltip = 'End Time';

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
    this.maxDate = new Date();

    this.iconRegistry.addSvgIcon('clock', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/clock.svg'));
  }

  public ngOnInit(): void {
    if (this.filterDate) {
      this.endDate = new Date(this.filterDate);
      this.endTime = this.filterTime;
    }

    // If we're on the snapshot page, change the tooltips.
    if (this.endDateOnly) {
      this.endDateTooltip = 'Date';
      this.endTimeTooltip = 'Time';
    }
  }

  public onDateChange(): void {
    // user selected endDate first
    if (this.endDate && !this.startDate) {
      this.startDate = this.minDate;
    }

    this.filter.emit({
      startDate: moment(this.addTime(this.startDate, this.startTime)),
      endDate: moment(this.endDate ? this.addTime(this.endDate, this.endTime) : undefined)
    });
  }

  public clearFilter(): void {
    this.startDate = undefined;
    this.startTime = this.DEFAULT_TIME;
    this.endDate = undefined;
    this.endTime = this.DEFAULT_TIME;

    this.filter.emit({ startDate: undefined, endDate: undefined });
  }

  /**
   * Takes a date and a time and adds them together using moment. Returns the value in Date format.
   *
   * @param date
   * @param time
   */
  private addTime(date: Date, time: string): Date {
    const momentTime = moment(time, StateTrackerConstants.MOMENT_TIME_FORMAT);

    return moment(date).add({ hours: momentTime.hours(), minutes: momentTime.minutes() }).toDate();
  }
}

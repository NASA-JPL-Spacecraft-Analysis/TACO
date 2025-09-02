import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { ItemChanges, DateFilter } from '../models';
import { StateTrackerConstants } from '../consts/StateTrackerConstants';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  constructor() { }

  /**
   * Returns array of only the most up-to-date changes
   * @param changes
   */
  public selectLatest(changes: ItemChanges[]): Map<number, ItemChanges> {
    // map to keep track of the most "recent" change for every itemId
    const mostRecent = new Map<number, ItemChanges>();

    for (const change of changes) {
      const { itemId } = change;
      if (!mostRecent.has(itemId)) {
        mostRecent.set(itemId, change);
      } else {
        const existingChangeDate = moment(mostRecent.get(itemId).updated, StateTrackerConstants.MOMENT_DATE_FORMAT);
        const thisChangeDate = moment(change.updated, StateTrackerConstants.MOMENT_DATE_FORMAT);

        // if this change is more recent, add it instead
        if (thisChangeDate.isAfter(existingChangeDate)) {
          mostRecent.set(itemId, change);
        }
      }
    }

    return mostRecent;
  }

  /**
   * Returns if a certain change was uploaded within the date(s) of a filter
   * @param change a single ItemChanges object
   * @param param1 DateFilter object containing dates to filter
   */
  public isChangeWithinFilter(change: ItemChanges, { startDate, endDate }: DateFilter): boolean {
    const changeDate = moment(change.updated, StateTrackerConstants.MOMENT_DATE_FORMAT);

    if (startDate && endDate) {
      return changeDate.isBetween(startDate, endDate);
    }

    if (startDate) {
      return changeDate.isAfter(startDate);
    }

    if (endDate) {
      return changeDate.isBefore(endDate);
    }

    // if no filter at all, then it is within the constraints of "all dates"
    return true;
  }


  /**
   * Handles filtering changes between two dates.
   * @param changes
   * @param filter
   */
  public filterChangesForDates(changes: ItemChanges[], filter: DateFilter): ItemChanges[] {
    return changes.filter(change => this.isChangeWithinFilter(change, filter));
  }
}

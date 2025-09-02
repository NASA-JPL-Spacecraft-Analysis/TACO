import * as moment from 'moment';

export interface DateFilter {
  startDate?: moment.Moment;
  endDate: moment.Moment;
}

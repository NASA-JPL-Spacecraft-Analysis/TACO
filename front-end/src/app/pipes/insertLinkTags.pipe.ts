import { Pipe, PipeTransform } from '@angular/core';
import { StateTrackerConstants } from '../consts/StateTrackerConstants';

@Pipe({ name: 'insertLinkTags' })
export class InsertLinkTagsPipe implements PipeTransform {
  public transform(value: string): string {
    if (!value) {
      return '';
    }

    const replaced = value.replace(StateTrackerConstants.LINK_REGEX, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    return replaced;
  }
}

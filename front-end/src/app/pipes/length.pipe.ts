import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'length' })
export class LengthPipe implements PipeTransform {
  public transform(value: unknown[]): number {
    return value.length;
  }
}

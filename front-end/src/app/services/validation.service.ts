import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  // either returns the number version of this object or, if the
  // resulting number is zero, returns null instead
  public numberOrNull(data: any): number | null {
    return Number(data) || null;
  }
}

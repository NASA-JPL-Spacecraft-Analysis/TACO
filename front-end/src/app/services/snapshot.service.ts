import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Comparison } from '../models';
import { environment } from 'src/environments/environment';

const { baseUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class SnapshotService {
  constructor(
    private httpClient: HttpClient
  ) {}

  public getComparisons(startDateTime: string, endDateTime: string, testbedId: number): Observable<Comparison[]> {
    return this.httpClient.get<Comparison[]>(
      baseUrl + '/testbed/' + testbedId + '/comparison/' + startDateTime + '/' + endDateTime
    );
  }
}

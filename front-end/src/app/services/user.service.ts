import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../models';
const { baseUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getCanEdit(testbedId: number): Observable<boolean> {
    return this.http.get<boolean>(baseUrl + '/can-edit/' + testbedId);
  }

  public getUser(): Observable<User> {
    // Return empty when we're not running in production mode.
    if (isDevMode()) {
      return of({
        filteredGroupList: [],
        fullName: '',
        groupList: [],
        userId: ''
      });
    }

    return this.http.get<User>(baseUrl + '/user');
  }

  public getIsAdmin(): Observable<boolean> {
    return this.http.get<boolean>(baseUrl + '/is-admin');
  }
}

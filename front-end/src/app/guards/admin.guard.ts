import { Injectable } from '@angular/core';
import { CanActivate, Router  } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getIsAdmin } from '../selectors';
import { AppState } from '../app-store';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  public canActivate(): Observable<boolean> {
    return this.store.select(getIsAdmin).pipe(
      map((isAdmin: boolean) => {
        if (!isAdmin) {
          // Use -1 as the testbed id, and our effect will route the user to the first testbed.
          this.router.navigate([ '/testbed/-1' ]);
        }

        return isAdmin;
      })
    );
  }
}

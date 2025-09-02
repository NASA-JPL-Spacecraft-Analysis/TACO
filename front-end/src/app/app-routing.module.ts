import { NgModule } from '@angular/core';
import { RouterModule, Routes, Params, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

import {
  VizComponent,
  ItemDetailComponent,
  HistoryComponent,
  JsonStructureComponent,
  SnapshotComponent,
  FaqComponent,
  ManagementComponent,
  SnapshotComparisonComponent
} from './containers';
import { AdminGuard } from './guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'testbed/'
  },
  {
    component: VizComponent,
    path: 'testbed/:testbedId'
  },
  {
    component: HistoryComponent,
    path: 'testbed/:testbedId/history'
  },
  {
    component: SnapshotComponent,
    path: 'testbed/:testbedId/snapshot',
  },
  {
    component: SnapshotComparisonComponent,
    path: 'testbed/:testbedId/snapshot/comparison'
  },
  {
    component: ItemDetailComponent,
    path: 'testbed/:testbedId/item/:itemId'
  },
  {
    component: JsonStructureComponent,
    path: 'upload'
  },
  {
    component: FaqComponent,
    path: 'help'
  },
  {
    canActivate: [ AdminGuard ],
    component: ManagementComponent,
    path: 'admin'
  },
  {
    path: '**',
    redirectTo: 'testbed/-1'
  }
];
@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ]
})
export class AppRoutingModule {}

export interface RouterState {
  params: Params;
  path: string;
  queryParams: Params;
  url: string;
}

export class RouterSerializer implements RouterStateSerializer<RouterState> {
  public serialize(routerStateSnapshot: RouterStateSnapshot): RouterState {
    const { url, root } = routerStateSnapshot;

    let route = root;
    const path: string[] = [];

    while (route.firstChild) {
      route = route.firstChild;

      if (route.routeConfig && route.routeConfig.path) {
        path.push(route.routeConfig.path);
      }
    }

    const routerState: RouterState = {
      params: route.params,
      path: path.join('/'),
      queryParams: root.queryParams,
      url
    };

    return routerState;
  }
}

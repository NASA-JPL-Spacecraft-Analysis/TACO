import { AppHeaderModule } from './app-header/app-header.module';
import { FaqModule } from './faq/faq.module';
import { HistoryModule } from './history/history.module';
import { ItemDetailModule } from './item-detail/item-detail.module';
import { JsonStructureModule } from './json-structure/json-structure.module';
import { ManagementModule } from './management/management.module';
import { VizModule } from './viz/viz.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { NgModule } from '@angular/core';

const MODULES = [
  AppHeaderModule,
  FaqModule,
  HistoryModule,
  ItemDetailModule,
  JsonStructureModule,
  ManagementModule,
  SnapshotModule,
  VizModule
];

@NgModule({
  exports: MODULES,
  imports: MODULES
})
export class ContainersModule {}

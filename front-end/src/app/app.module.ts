import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { metaReducers, ROOT_REDUCERS } from './app-store';
import { AppRoutingModule, RouterSerializer } from './app-routing.module';
import {
  ItemEffects,
  NavEffects,
  OutputEffects,
  SnapshotEffects,
  StructureEffects,
  TestbedEffects,
  ToastEffects,
  UserEffects
} from './effects';
import { MessageDialogModule } from './components/message-dialog/message-dialog.module';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { ItemFormDialogComponent } from './components/item-form-dialog/item-form-dialog.component';
import { ItemFormDialogModule } from './components/item-form-dialog/item-form-dialog.module';
import { ItemDataDialogModule } from './components/item-data-dialog/item-data-dialog.module';
import { ItemDataDialogComponent } from './components/item-data-dialog/item-data-dialog.component';
import { StatusDialogModule, StatusDialogComponent } from './components';
import { AdminGuard } from './guards';
import { ContainersModule } from './containers';
import { ConfirmationDialogModule, ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from './material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ConfirmationDialogModule,
    StatusDialogModule,
    MaterialModule,
    MessageDialogModule,
    ItemFormDialogModule,
    ItemDataDialogModule,
    EffectsModule.forRoot([
      ItemEffects,
      OutputEffects,
      NavEffects,
      SnapshotEffects,
      StructureEffects,
      TestbedEffects,
      ToastEffects,
      UserEffects
    ]),
    HttpClientModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
      serializer: RouterSerializer
    }),
    ToastrModule.forRoot({
      countDuplicates: true,
      maxOpened: 4,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    ContainersModule
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    ItemFormDialogComponent,
    ItemDataDialogComponent,
    MessageDialogComponent,
    StatusDialogComponent
  ],
  providers: [
    AdminGuard
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}

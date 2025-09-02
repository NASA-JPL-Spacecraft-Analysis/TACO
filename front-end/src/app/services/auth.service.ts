import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ItemChanges, ItemChangesHistory, ItemData, ItemDataHistory, ItemStatus, TestbedSettings } from '../models';

const { baseUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  public clearSortOrder(testbedId: number): Observable<boolean> {
    return this.http.post<boolean>(this.getAuthBaseUrl() + '/testbed/' + testbedId + '/clear-sort-order', true);
  }

  public createItemData(itemData: ItemData): Observable<ItemData> {
    return this.http.post<ItemData>(this.getAuthBaseUrl() + '/item-data', itemData);
  }

  public createItemStatus(itemStatus: ItemStatus): Observable<ItemStatus> {
    return this.http.post<ItemStatus>(this.getAuthBaseUrl() + '/item-status', itemStatus);
  }

  public getItemChangesHistory(): Observable<ItemChangesHistory[]> {
    return this.http.get<ItemChangesHistory[]>(this.getAuthBaseUrl() + '/item-changes-history');
  }

  public getItemDataHistory(): Observable<ItemDataHistory[]> {
    return this.http.get<ItemDataHistory[]>(this.getAuthBaseUrl() + '/item-data-history');
  }

  public deleteItemChanges(itemChangesId: number): Observable<boolean> {
    return this.http.post<boolean>(this.getAuthBaseUrl() + '/delete-item-change/' + itemChangesId, true);
  }

  public deleteItemData(itemDataId: number): Observable<boolean> {
    return this.http.post<boolean>(this.getAuthBaseUrl() + '/delete/' + itemDataId, true);
  }

  public toggleLockItem(locked: boolean, itemId: number): Observable<boolean> {
    return this.http.put<boolean>(this.getAuthBaseUrl() + '/toggle-lock/' + itemId, locked);
  }

  public updateItemChange(itemChange: ItemChanges): Observable<ItemChanges> {
    return this.http.put<ItemChanges>(this.getAuthBaseUrl() + '/item-change/', itemChange);
  }

  public updateItemData(itemData: ItemData): Observable<ItemData> {
    return this.http.put<ItemData>(this.getAuthBaseUrl() + '/item-data/', itemData);
  }

  public updateItemStatus(itemStatus: ItemStatus): Observable<ItemStatus> {
    return this.http.put<ItemStatus>(this.getAuthBaseUrl() + '/item-status', itemStatus);
  }

  public updateSortOrder(sortOrder: number, testbedId: number): Observable<number> {
    return this.http.put<number>(this.getAuthBaseUrl() + '/testbed/' + testbedId + '/sort-order', sortOrder);
  }

  public updateTestbedSettings(testbedSettings: TestbedSettings): Observable<TestbedSettings> {
    return this.http.put<TestbedSettings>(this.getAuthBaseUrl() + '/testbed-settings/', testbedSettings);
  }

  private getAuthBaseUrl(): string {
    return baseUrl.substring(0, baseUrl.lastIndexOf('/')) + '/auth/v1';
  }
}

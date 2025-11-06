import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TestbedToItemDataMap, ItemChanges, Testbed, ItemData, TestbedSettings, ItemDataMap } from '../models';
import { environment } from 'src/environments/environment';

const { baseUrl } = environment;

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) { }

  public getItemsByTestbedId(): Observable<TestbedToItemDataMap> {
    return this.http.get<TestbedToItemDataMap>(baseUrl + '/api/item-data-map');
  }

  public getHistory(testbedId: number): Observable<ItemChanges[]> {
    return this.getHistoryHttp(testbedId);
  }

  public getItemChangesById(itemId: number): Observable<ItemChanges[]> {
    return this.http.get<ItemChanges[]>(baseUrl + '/api/item-changes/' + itemId);
  }

  public getItemData(testbedId: number): Observable<ItemDataMap> {
    return this.http.get<ItemDataMap>(baseUrl + '/api/testbed/' + testbedId + '/item-data/');
  }

  public getSnapshot(dateTime: string, testbedId: number): Observable<ItemData[]> {
    let url = baseUrl + '/api/testbed/' + testbedId + '/snapshot';

    // If datetime is null, don't include it in our query.
    if (dateTime) {
      url += '/' + dateTime;
    }

    return this.http.get<ItemData[]>(url);
  }

  public getTestbeds(): Observable<Testbed[]> {
    return this.getTestbedsHttp();
  }

  public getTestbedSettings(): Observable<TestbedSettings[]> {
    return this.http.get<TestbedSettings[]>(baseUrl + '/api/settings/');
  }

  public createItemChanges(itemId: number, data: ItemChanges): Observable<ItemChanges> {
    return this.http.post<ItemChanges>(baseUrl + '/api/item-changes/' + itemId, data);
  }

  public putItemDescription(description: string, itemId: number): Observable<string> {
    return this.http.put<string>(baseUrl + '/api/item-data/' + itemId + '/description', description, { responseType: 'text' as 'json' });
  }

  public putTestbedDescription(description: string, testbedId: number): Observable<string> {
    return this.http.put<string>(baseUrl + '/api/testbed/' + testbedId + '/description', description, { responseType: 'text' as 'json' });
  }

  public toggleOnline(item: ItemData): Observable<ItemData> {
    return this.http.put<ItemData>(baseUrl + '/api/toggle-online/' + item.id, item);
  }

  public toggleEnabled(item: ItemData): Observable<ItemData> {
    return this.http.put<ItemData>(baseUrl + '/api/toggle-enabled/' + item.id, item);
  }

  public deleteItemChanges(id: number): Observable<number> {
    return this.http.delete<number>(baseUrl + '/api/item-changes/' + id);
  }

  public getImage(itemChangesId: number): Observable<File> {
    return this.http.get<File>(baseUrl + '/api/image/' + itemChangesId, { responseType: 'blob' as 'json' });
  }

  public saveImage(itemChangeId: number, image: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', image, image.name);

    return this.http.post<void>(baseUrl + '/api/image/' + itemChangeId, formData);
  }

  private getHistoryHttp(testbedId: number): Observable<ItemChanges[]> {
    return this.http.get<ItemChanges[]>(baseUrl + '/api/history/' + testbedId);
  }

  private getTestbedsHttp(): Observable<Testbed[]> {
    return this.http.get<Testbed[]>(baseUrl + '/api/testbeds');
  }
}

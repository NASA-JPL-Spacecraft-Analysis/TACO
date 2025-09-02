import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { withLatestFrom, map, concatMap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

import { OutputActions } from '../actions';
import { NumberTMap, ItemStatus, JsonStructure, ItemData } from '../models';
import { ExportService } from '../services/export.service';
import { AppState } from '../app-store';

@Injectable()
export class OutputEffects {
  private static JSON_ESCAPED_QUOTE = new RegExp(/\\"/g);
  private static JSON_ESCAPED_NEWLINE = new RegExp(/\\n/g);

  constructor(
    private actions: Actions,
    private store: Store<AppState>,
    private exportService: ExportService
  ) {}

  public createHistoryOutput = createEffect(() =>
    this.actions.pipe(
      ofType(OutputActions.CreateHistoryOutput),
      withLatestFrom(this.store),
      map(([action]) => ({ action })),
      concatMap(({ action }) => {
        this.writeToCsvFile(action.history, action.itemData, action.statuses, 'export.csv');

        return [];
      }),
    )
  );

  public createSnapshotJSONOutput = createEffect(() =>
    this.actions.pipe(
      ofType(OutputActions.CreateSnapshotJSONOutput),
      withLatestFrom(this.store),
      map(([{ testbed, latest, itemStatuses }]) => {
        return {
          testbed,
          latest,
          itemStatuses
        };
      }),
      concatMap(({ testbed, latest, itemStatuses }) => {
        // if empty history, do nothing
        if (latest.length === 0) {
          return [];
        }

        const testbedStructure = this.exportService.cleanTestbedForExport(testbed);
        testbedStructure.items = this.exportService.cleanItemDataForExport(latest, itemStatuses);

        const statuses = this.exportService.cleanStatusesForExport(itemStatuses);
        const jsonStructure = { statuses, testbedStructure};

        this.writeToJsonFile(jsonStructure, 'snapshot.json');

        return [];
      })
    )
  );

  public createSnapshotCSVOutput = createEffect(() =>
    this.actions.pipe(
      ofType(OutputActions.CreateSnapshotCSVOutput),
      withLatestFrom(this.store),
      map(([{ testbed, latest, itemStatuses }]) => {
        return {
          testbed,
          latest,
          itemStatuses
        };
      }),
      concatMap(({ testbed, latest, itemStatuses }) => {
        if (latest.length === 0) {
          return [];
        }

        const testbedStructure = this.exportService.cleanTestbedForExport(testbed);
        testbedStructure.items = this.exportService.cleanItemDataForExport(latest, itemStatuses);

        const { items, name } = testbedStructure;
        const csvData = this.exportService.cleanStructureForCSVExport(name, items);

        this.writeGenericToCSVFile(csvData, 'snapshot.csv');

        return [];
      })
    )
  );

  private convertJsonData(data: object): string {
    const replacer = (key: string, val: object) => {
      if (val !== null) {
        return val;
      }
    };

    return JSON.stringify(data, replacer, 4);
  }

  private convertCsvData(data: object[], itemData: NumberTMap<ItemData>, statuses: NumberTMap<ItemStatus>): string {
    const replacer = (key: string, value: object) => value === null ? '' : value;
    const header = Object.keys(data[0]);

    let splitData: Array<string> = data.map(
      (row: object) => {
        row = {
          ...row
        };

        const item = itemData[row['itemId']];

        // Reassign the id column to the parent's name.
        if (item.parentId === null) {
          // Item doesn't have a parent.
          row['id'] = null;
        } else {
          row['id'] = itemData[item.parentId].name;
        }

        // Reassign the itemId column to the item's name.
        row['itemId'] = item.name;

        // Replace status ID with the actual value if it's not null.
        if (row['status'] !== null) {
          row['status'] = statuses[row['status']].status;
        }

        return header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',');
      }
    );

    // Rename the 2 columns that we reassign during the export.
    header[header.indexOf('id')] = 'parentName';
    header[header.indexOf('itemId')] = 'itemName';

    /**
     * JSON.stringify escapes double quotes within strings with a backslash, but
     * CSV format requires escaping double quotes with a preceding double quote instead.
     */
    splitData = splitData.map(str => str.replace(OutputEffects.JSON_ESCAPED_QUOTE, '""'));

    /**
     * JSON.stringify escapes newline chars into "\n", but we need to turn it
     * back into the actual newline character.
     */
    splitData.unshift(header.join(','));

    return splitData.join('\r\n');
  }

  private convertGenericToCSVFormat<T extends object>(data: T[]): string {
    if (data.length === 0) {
      return '';
    }

    const replacer = (key: string, value: T) => value === null ? '' : value;
    const header = Object.keys(data[0]);

    let splitData: string[] = data.map((row: T) => {
      return header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',');
    });

    // JSON.stringify escapes double quotes within strings with a backslash, but
    // CSV format requires escaping double quotes with a preceding double quote instead
    splitData = splitData.map(str => str.replace(OutputEffects.JSON_ESCAPED_QUOTE, '""'));

    // also, JSON.stringify escapes newline chars into "\n", but we need to turn it
    // back into the actual newline character
    splitData = splitData.map(str => str.replace(OutputEffects.JSON_ESCAPED_NEWLINE, '\n'));

    splitData.unshift(header.join(','));
    return splitData.join('\r\n');
  }

  private writeGenericToCSVFile<T extends object>(data: T[], filename: string): void {
    const blob = new Blob([this.convertGenericToCSVFormat(data)], { type: 'text/plain' });

    saveAs(blob, filename);
  }

  private writeToCsvFile(data: object[], itemData: NumberTMap<ItemData>, statuses: NumberTMap<ItemStatus>, filename: string): void {
    const blob = new Blob([this.convertCsvData(data, itemData, statuses)], { type: 'text/plain' });

    saveAs(blob, filename);
  }

  private writeToJsonFile(jsonStructure: JsonStructure, filename: string): void {
    const blob = new Blob([this.convertJsonData(jsonStructure)], { type: 'text/plain' });

    saveAs(blob, filename);
  }
}

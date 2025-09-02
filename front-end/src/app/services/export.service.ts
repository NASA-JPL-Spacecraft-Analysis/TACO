import { Injectable } from '@angular/core';
import { flatMap } from 'lodash';

import {
  Testbed,
  TestbedStructure,
  StatusStructure,
  NumberTMap,
  ItemStatus,
  ItemStructure,
  ItemData,
  ItemChangesExport,
  CSVOutputFormat
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  /**
   * Converts a testbed into our export format.
   *
   * @param testbed
   */
  public cleanTestbedForExport(testbed: Testbed): TestbedStructure {
    const {
      name,
      acronym,
      items
    } = testbed;

    return {
      name,
      acronym,
      items
    };
  }

  /**
   * Converts an ItemStatus into our export format.
   *
   * @param statuses
   */
  public cleanStatusesForExport(statuses: NumberTMap<ItemStatus>): StatusStructure[] {
    const cleanedStatuses = [];

    for (const key of Object.keys(statuses)) {
      const {
        status,
        color
      } = statuses[key];

      cleanedStatuses.push({ status, color });
    }

    return cleanedStatuses;
  }

  /**
   * Takes our root item and converts it into our export format.
   *
   * @param itemData
   * @param rootItem
   * @param statuses
   */
  public cleanItemDataForExport(itemData: ItemData[], statuses: NumberTMap<ItemStatus>): ItemStructure[] {
    return itemData.map(this.cleanItem(statuses));
  }

  public cleanStructureForCSVExport(testbedName: string, items: ItemStructure[]): CSVOutputFormat[] {
    const itemStructureToOutput = (item: ItemStructure, parentName: string): CSVOutputFormat[] => {
      const isLeaf = !item.children;

      if (isLeaf) {
        if (item.latestChange) {
          const { latestChange } = item;
          return [{
            containedBy: parentName,
            status: latestChange.status as string,
            name: item.fullname,
            description: latestChange.description,
            version: latestChange.version,
            serialNumber: latestChange.serialNumber,
            partNumber: latestChange.partNumber,
            username: latestChange.username,
            updated: latestChange.updated,
            rationale: latestChange.rationale
          }];
        } else {
          // put in some default/empty values
          return [{
            containedBy: parentName,
            status: '',
            name: item.fullname,
            description: '',
            version: '',
            serialNumber: '',
            partNumber: '',
            username: '',
            updated: '',
            rationale: ''
          }];
        }
      } else {
        return flatMap(item.children, (child) => itemStructureToOutput(child, item.fullname));
      }
    };

    // Create a flattened array that contains all our history.
    return ([] as CSVOutputFormat[]).concat(...items.map(item => itemStructureToOutput(item, testbedName)));
  }

  private cleanItem(statuses: NumberTMap<ItemStatus>): (itemData: ItemStructure) => ItemStructure {
    return (itemData: ItemStructure) => {
      const {
        name,
        fullname,
        online
      } = itemData;

      let latestChange = itemData.latestChange;

      if (latestChange) {
        latestChange = this.cleanItemChanges(itemData.latestChange, statuses);
      }

      let children = itemData.children;

      if (children) {
        // Type assertion is required to map for our omit type.
        children = (itemData.children as Array<ItemStructure>).map(this.cleanItem(statuses));
      }

      return { name, fullname, online, latestChange, children };
    };
  }

  private cleanItemChanges(itemChanges: ItemChangesExport, statuses: NumberTMap<ItemStatus>): ItemChangesExport {
    const {
      description,
      version,
      serialNumber,
      partNumber,
      username,
      updated,
      rationale,
      image
    } = itemChanges;

    const status = itemChanges.status ? statuses[itemChanges.status].status : null;

    return {
      status,
      description,
      version,
      serialNumber,
      partNumber,
      username,
      updated,
      rationale,
      image
    };
  }
}

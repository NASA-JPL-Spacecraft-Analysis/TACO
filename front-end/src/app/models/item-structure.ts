import {  ItemChangesExport } from './item-changes';

// Defines all models for JSON structure upload and export.

export interface TestbedStructure {
  name: string;
  acronym: string;
  items: ItemStructure[];
}

export interface ItemStructure {
  name: string;
  fullname: string;
  online: boolean;
  children?: ItemStructure[];
  latestChange?: ItemChangesExport;
}

export interface StatusStructure {
  status: string;
  color: string;
}

export interface JsonStructure {
  statuses: StatusStructure[];
  testbedStructure: TestbedStructure;
}

/**
 * Because we don't support name and fullname on our changes, we need this interface
 * to hold out output format.  This can be changed when we re-work the way we store item names.
 */
export interface JSONOutputFormat {
  name: string;
  fullname: string;
  status: number | string; // We want a string here so we can store actual status.
  description: string;
  version: string;
  serialNumber: string;
  partNumber: string;
  username: string;
  updated: string;
  rationale: string;
}

export interface CSVOutputFormat extends Omit<JSONOutputFormat, 'fullname'> {
  containedBy: string; // represents the parent's fullname of this component
  status: string;
}

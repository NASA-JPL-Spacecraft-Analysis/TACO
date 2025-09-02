import { ItemChanges } from './item-changes';

interface Action {
  changes: ItemChanges;
}

interface CopyAction extends Action {
  type: 'copy';
}

interface EditAction extends Action {
  type: 'edit';
}

interface DeleteAction extends Action {
  type: 'delete';
}

// When / if we add more actions, union them with CopyAction here.
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
export type EntryAction = CopyAction | EditAction | DeleteAction;

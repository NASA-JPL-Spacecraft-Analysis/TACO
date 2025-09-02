import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';

import { reducers as rootReducers } from '../../app-store';
import { reducers } from '../testbed-viz-store';
import { ItemEffects } from './item.effects';
import { Observable } from 'rxjs';
import { ItemService } from '../services/item.service';
import { CreateItemChanges } from '../actions/item.actions';

describe('ItemEffects', () => {
  let actions$: Observable<any>;
  let effects: ItemEffects;
  let metadata: EffectsMetadata<ItemEffects>;
  let mockItemService;

  beforeEach(() => {
    mockItemService = jasmine.createSpyObj('ItemService',
      [ 'createItemChanges', 'getItems', 'getItemChanges' ]
    );

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(rootReducers),
        StoreModule.forFeature('testbed-viz', reducers)
      ],
      providers: [
        ItemEffects,
        provideMockActions(() => actions$),
        {
          provide: ItemService,
          useValue: mockItemService
        },
        Store
      ]
    });

    effects = TestBed.get(ItemEffects);
    metadata = getEffectsMetadata(effects);
  });

  describe('createItemChanges$', () => {
    it('should register createItemChanges$ that dispatches an action', () => {
      expect(metadata.createItemChanges$).toEqual({ dispatch: true });
    });
  });

  describe('fetchItems$', () => {
    it('should register fetchItems$ that dispatches an action', () => {
      expect(metadata.fetchItems$).toEqual({ dispatch: true });
    });
  });

  describe('fetchItemChanges$', () => {
    it('should register fetchItemChanges$ that dispatches an action', () => {
      expect(metadata.fetchItemChanges$).toEqual({ dispatch: true });
    });
  });
});

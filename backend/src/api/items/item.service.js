import * as itemRepo from './item.repository.js';
import { logger } from '../../utils/logger.js';

const isoParse = (s) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
};

const toMysqlDateTime = (d) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    const mm = pad(d.getUTCMonth() + 1);
    const dd = pad(d.getUTCDate());
    const hh = pad(d.getUTCHours());
    const mi = pad(d.getUTCMinutes());
    const ss = pad(d.getUTCSeconds());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

const lowerCamelToSnake = (s) => s.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());

const searchableFields = new Set([
    'description',
    'name',
    'partNumber',
    'rationale',
    'serialNumber',
    'status',
    'username',
    'version'
]);

const getComparison = async (testbedId, firstDateString, secondDateString) => {
    const first = isoParse(firstDateString);
    const second = isoParse(secondDateString);
    if (!first || !second) return null;
    const older = first < second ? first : second;
    const newer = first < second ? second : first;
    const oldestHistory = await itemRepo.getItemChangesByDateTime(testbedId, toMysqlDateTime(older));
    const newestHistory = await itemRepo.getItemChangesByDateTime(testbedId, toMysqlDateTime(newer));
    const itemDataMap = await getItemDataMap(testbedId);
    const oldestMap = new Map();
    oldestHistory.forEach((c) => oldestMap.set(c.itemId, c));
    const out = [];
    for (const c of newestHistory) {
        const olderC = oldestMap.get(c.itemId) || null;
        if (!olderC || JSON.stringify(c) !== JSON.stringify(olderC)) {
            const itemName = itemDataMap.get(c.itemId)?.name;
            out.push(...findDifferences(c, olderC, itemName));
        }
    }
    return out;
};

const getItemDataMapAll = async () => {
    const itemList = await itemRepo.getItemMetadata();
    const map = new Map();
    for (const item of itemList) {
        if (!map.has(item.testbedId)) map.set(item.testbedId, new Map());
        map.get(item.testbedId).set(item.id, item);
    }
    const obj = {};
    for (const [tbId, m] of map.entries()) {
        obj[tbId] = Object.fromEntries(Array.from(m.entries()));
    }
    return obj;
};

const getItemDataMap = async (testbedId) => mapItemData(testbedId);

const getItemChangesById = async (id) => itemRepo.getItemChangesById(id);

const getItemChangesByItemId = async (itemId) => itemRepo.getItemChangesById(itemId, true);

const getLatestItemChanges = async () => itemRepo.getLatestItemChanges();

const getItemMetadata = async (testbedId) => itemRepo.getItemMetadata(testbedId);

const getItemMetadataWithIds = async (testbedId, itemIdList) => {
    const itemDataList = await getItemMetadata(testbedId);
    const metaMap = await mapItemData(testbedId);
    if (itemIdList && itemIdList.length > 0) {
        return itemIdList.map((id) => metaMap.get(id)).filter(Boolean);
    }
    return itemDataList;
};

const searchItemChangesForTestbeds = async (search, testbedIds) => {
    if (!testbedIds || testbedIds.length === 0) return [];
    return itemRepo.searchItemChangesForTestbeds(search, testbedIds);
};

const getSnapshot = async (testbedId) => getItemData(testbedId, null);

const getSnapshotAt = async (testbedId, dateTime) => {
    const parsed = isoParse(dateTime);
    if (!parsed) return null;
    const history = await itemRepo.getItemChangesByDateTime(testbedId, toMysqlDateTime(parsed));
    return getItemData(testbedId, history);
};

const toggleOnline = async (itemData) => itemRepo.toggleOnline(itemData);

const getItemDataById = async (itemId) => {
    const changes = await getItemChangesByItemId(itemId);
    const item = await itemRepo.getItemDataById(itemId);
    if (!item) return null;
    if (changes && changes.length > 0) item.latestChange = changes[0];
    return item;
};

const getItemData = async (testbedId, history) => {
    const items = await getItemMetadata(testbedId);
    const latest = history || (await getLatestItemChanges());
    const byId = new Map();
    const roots = [];
    for (const item of items) {
        byId.set(item.id, item);
        if (item.parentId == null) roots.push(item);
    }
    for (const c of latest) {
        const it = byId.get(c.itemId);
        if (it) it.latestChange = c;
    }
    for (const item of items) {
        if (item.parentId != null) {
            const parent = byId.get(item.parentId);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(item);
            }
        }
    }
    return roots;
};

const getItemChanges = async (testbedId) => itemRepo.getHistory(testbedId);

const postItemChange = async (itemId, itemChanges) => {
    const item = await itemRepo.getItemDataById(itemId);
    if (!item || item.locked) return null;
    const id = await itemRepo.postItemChange(itemId, itemChanges);
    if (id === -1) return null;
    return itemRepo.getItemChangesById(id);
};

const getAllItemStatuses = async () => {
    const list = await itemRepo.getItemStatus(null);
    const map = new Map();
    for (const s of list) {
        if (!map.has(s.testbedId)) map.set(s.testbedId, []);
        map.get(s.testbedId).push(s);
    }
    const obj = {};
    for (const [k, v] of map.entries()) obj[k] = v;
    return obj;
};

const getItemStatus = async (testbedId) => itemRepo.getItemStatus(testbedId);

const postItems = async (testbedId, itemStructures) => {
    await itemRepo.postItems(testbedId, itemStructures);
    const createdItems = await itemRepo.getItemMetadata(testbedId);
    const changes = [];
    for (const i of createdItems) {
        changes.push({ itemId: i.id, username: 'System', rationale: 'Initial value upload' });
    }
    await itemRepo.postItemChanges(changes);
};

const mapItemData = async (testbedId) => {
    const items = await getItemMetadata(testbedId);
    const latest = await getLatestItemChanges();
    const idMap = new Map();
    const map = new Map();

    for (const i of items) {


        if (!map.has(i.id)) map.set(i.id, i);

        idMap.set(i.id, i);
        map.set(i.id, i);
    }

    for (const c of latest) {
        const it = map.get(c.itemId);
        if (it) it.latestChange = c;
    }


    return map;
};

const searchItemChanges = async (queryParams) => {
    const searchMap = {};
    for (const key of Object.keys(queryParams || {})) {
        if (searchableFields.has(key)) {
            searchMap[lowerCamelToSnake(key)] = Array.isArray(queryParams[key]) ? queryParams[key][0] : queryParams[key];
        }
    }
    if (Object.keys(searchMap).length === 0) return [];
    return itemRepo.searchItemChanges(searchMap);
};

const updateItemDescription = async (itemId, description) => itemRepo.updateItemDescription(itemId, description);

const getItemMetadataHistory = async () => itemRepo.getItemMetadataHistory();

const createItemData = async (itemData, username) => itemRepo.createItemData(itemData, username);

const updateItemData = async (itemData, username) => itemRepo.updateItemData(itemData, username);

const findDifferences = (one, two, itemName) => {
    const list = [];
    const fields = Array.from(searchableFields.values());
    for (const f of fields) {
        const v1 = one && one[f] != null ? String(one[f]) : '';
        const v2 = two && two[f] != null ? String(two[f]) : '';
        const updated = one && one.updated ? one.updated : '';
        const cmp = createComparison(f, v1, v2, itemName, updated);
        if (cmp) list.push(cmp);
    }
    return list;
};

const createComparison = (field, valueOne, valueTwo, itemName, updated) => {
    if (valueOne !== valueTwo) {
        return { field, itemName, newValue: valueOne, oldValue: valueTwo, updated };
    }
    return null;
};

export {
    getComparison,
    getItemDataMapAll,
    getItemDataMap,
    getItemChangesById,
    getItemChangesByItemId,
    getLatestItemChanges,
    getItemMetadata,
    getItemMetadataWithIds,
    searchItemChangesForTestbeds,
    getSnapshot,
    getSnapshotAt,
    toggleOnline,
    getItemDataById,
    getItemData,
    getItemChanges,
    postItemChange,
    getAllItemStatuses,
    getItemStatus,
    postItems,
    searchItemChanges,
    updateItemDescription,
    getItemMetadataHistory,
    createItemData,
    updateItemData
};

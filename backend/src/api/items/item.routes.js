import express from 'express';
import * as itemService from './item.service.js';
import { asyncHandler } from '../middleware/error.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const getItemDataHandler = asyncHandler(async (req, res) => {
    const testbedId = parseInt(req.params.testbedId, 10);
    const itemDataMap = await itemService.getItemDataMap(testbedId);

    // console.log('itemDataMap', itemDataMap);

    // If map is empty, fallback to raw item metadata list for this testbed
    const isEmptyMap = !itemDataMap || (itemDataMap instanceof Map && itemDataMap.size === 0) || (typeof itemDataMap === 'object' && Object.keys(itemDataMap).length === 0);

    if (isEmptyMap) {
        const metaList = await itemService.getItemMetadata(testbedId);

        // console.log('metaList', metaList);
        if (metaList && metaList.length > 0) {
            const toBool = (v) => v === true || v === 1;
            const shaped = {};
            for (const v of metaList) {
                const obj = {
                    id: v.id,
                    testbedId: v.testbedId,
                    name: v.name,
                    fullname: v.fullname,
                    online: toBool(v.online),
                    locked: toBool(v.locked),
                    deleted: toBool(v.deleted),
                };
                if (v.parentId !== null && v.parentId !== undefined) obj.parentId = v.parentId;
                shaped[String(v.id)] = obj;
            }
            return res.status(200).json(shaped);
        }
        return res.status(204).send();
    }

    const toBool = (v) => v === true || v === 1;
    const payload = {};
    for (const [id, v] of itemDataMap.entries()) {
        const obj = {
            id: v.id,
            testbedId: v.testbedId,
            name: v.name,
            fullname: v.fullname,
            online: toBool(v.online),
            locked: toBool(v.locked),
            deleted: toBool(v.deleted),
        };
        if (v.parentId !== null && v.parentId !== undefined) obj.parentId = v.parentId;
        if (v.latestChange) {
            const c = v.latestChange;
            obj.latestChange = {
                id: c.id,
                itemId: c.itemId,
                username: c.username,
                updated: c.updated,
                rationale: c.rationale,
                online: toBool(c.online),
                image: toBool(c.image),
            };
        }
        payload[String(id)] = obj;
    }

    // console.log('payload', payload);
    res.status(200).json(payload);
});

// Support both plural and singular base paths
router.get('/testbeds/:testbedId/item-data', getItemDataHandler);
router.get('/testbed/:testbedId/item-data', getItemDataHandler);

router.put(
    '/item-data/:itemId/description',
    asyncHandler(async (req, res) => {
        const itemId = parseInt(req.params.itemId, 10);
        const { description } = req.body || {};

        if (description === undefined) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const saved = await itemService.updateItemDescription(itemId, description);

        if (saved === null || saved === undefined) {
            return res.status(204).send();
        }

        res.status(200).json({ description: saved });
    })
);

// GET /api/item-changes - search by query params
router.get(
    '/item-changes',
    asyncHandler(async (req, res) => {
        const results = await itemService.searchItemChanges(req.query || {});
        if (!results || results.length === 0) return res.status(204).send();
        res.status(200).json(results);
    })
);

// GET /api/item-changes/:itemId - history for an item
router.get(
    '/item-changes/:itemId',
    asyncHandler(async (req, res) => {
        const itemId = parseInt(req.params.itemId, 10);
        const list = await itemService.getItemChangesByItemId(itemId);
        if (!list || list.length === 0) return res.status(204).send();
        res.status(200).json(list);
    })
);

// POST /api/item-changes/:itemId - create a change for an item
router.post(
    '/item-changes/:itemId',
    asyncHandler(async (req, res) => {
        const itemId = parseInt(req.params.itemId, 10);
        if (!req.body) return res.status(400).json({ error: 'Body required' });
        const created = await itemService.postItemChange(itemId, req.body);
        if (!created) return res.status(403).json({ error: 'Item is locked, so it cannot be modified' });
        res.status(200).json(created);
    })
);

// GET /api/item-data-map - all testbeds map of maps
router.get(
    '/item-data-map',
    asyncHandler(async (_req, res) => {
        const map = await itemService.getItemDataMapAll();
        if (!map || Object.keys(map).length === 0) return res.status(204).send();
        res.status(200).json(map);
    })
);

// GET /api/items/:itemId - flat item with latestChange
router.get(
    '/items/:itemId',
    asyncHandler(async (req, res) => {
        const itemId = parseInt(req.params.itemId, 10);
        const item = await itemService.getItemDataById(itemId);
        if (!item) return res.status(204).send();
        res.status(200).json(item);
    })
);

// GET /api/testbeds/:testbedId/items?itemId=1&itemId=2
router.get(
    '/testbeds/:testbedId/items',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        let { itemId } = req.query || {};
        const ids = Array.isArray(itemId)
            ? itemId.map((v) => parseInt(v, 10)).filter((n) => !isNaN(n))
            : itemId != null
                ? [parseInt(itemId, 10)].filter((n) => !isNaN(n))
                : [];
        const list = await itemService.getItemMetadataWithIds(testbedId, ids);
        if (!list || list.length === 0) return res.status(204).send();
        res.status(200).json(list);
    })
);

// GET /api/items/find?testbedIds=1&testbedIds=2&searchString=abc
router.get(
    '/items/find',
    asyncHandler(async (req, res) => {
        let { testbedIds, searchString } = req.query || {};
        const ids = Array.isArray(testbedIds)
            ? testbedIds.map((v) => parseInt(v, 10)).filter((n) => !isNaN(n))
            : testbedIds != null
                ? [parseInt(testbedIds, 10)].filter((n) => !isNaN(n))
                : [];
        const results = await itemService.searchItemChangesForTestbeds(searchString || '', ids);
        if (!results || results.length === 0) return res.status(204).send();
        res.status(200).json(results);
    })
);

// GET /api/testbeds/:testbedId/comparison/:firstDatetime/:secondDatetime
router.get(
    '/testbeds/:testbedId/comparison/:firstDatetime/:secondDatetime',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const { firstDatetime, secondDatetime } = req.params;
        const list = await itemService.getComparison(testbedId, firstDatetime, secondDatetime);
        if (!list) return res.status(400).json({ error: 'Invalid date format. Use ISO 8601 (e.g., 2020-08-24T19:40:42.000Z)' });
        if (list.length === 0) return res.status(204).send();
        res.status(200).json(list);
    })
);

// GET /api/testbeds/:testbedId/snapshot
router.get(
    '/testbeds/:testbedId/snapshot',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const tree = await itemService.getSnapshot(testbedId);
        if (!tree || tree.length === 0) return res.status(204).send();
        res.status(200).json(tree);
    })
);

// GET /api/testbeds/:testbedId/snapshot/:dateTime
router.get(
    '/testbeds/:testbedId/snapshot/:dateTime',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const { dateTime } = req.params;
        const tree = await itemService.getSnapshotAt(testbedId, dateTime);
        if (tree === null) return res.status(400).json({ error: 'Invalid date format. Use ISO 8601 (e.g., 2020-08-24T19:40:42.000Z)' });
        if (tree.length === 0) return res.status(204).send();
        res.status(200).json(tree);
    })
);

// GET /api/history/:testbedId
router.get(
    '/history/:testbedId',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const history = await itemService.getItemChanges(testbedId);
        if (!history || history.length === 0) return res.status(204).send();
        res.status(200).json(history);
    })
);

// ===== AUTH/V1 (Admin-like) endpoints =====
// NOTE: AUTH=NO_AUTH allows all (authenticate stub sets req.user). Other modes: TODO implement.

// Create item data
router.post(
    '/auth/v1/item-data',
    authenticate,
    asyncHandler(async (req, res) => {
        const username = req.user?.userId;
        const created = await itemService.createItemData(req.body, username);
        if (!created) return res.status(204).send();
        res.status(201).json(created);
    })
);

// Update item data
router.put(
    '/auth/v1/item-data',
    authenticate,
    asyncHandler(async (req, res) => {
        const username = req.user?.userId;
        const updated = await itemService.updateItemData(req.body, username);
        if (!updated) return res.status(204).send();
        res.status(200).json(updated);
    })
);

// Item data history
router.get(
    '/auth/v1/item-data-history',
    authenticate,
    asyncHandler(async (_req, res) => {
        const history = await itemService.getItemMetadataHistory();
        if (!history || history.length === 0) return res.status(204).send();
        res.status(200).json(history);
    })
);

// Item changes history
router.get(
    '/auth/v1/item-changes-history',
    authenticate,
    asyncHandler(async (_req, res) => {
        const history = await itemService.getItemChangesHistory();
        if (!history || history.length === 0) return res.status(204).send();
        res.status(200).json(history);
    })
);

// Delete item change
router.post(
    '/auth/v1/delete-item-change/:itemChangesId',
    authenticate,
    asyncHandler(async (req, res) => {
        const itemChangesId = parseInt(req.params.itemChangesId, 10);
        const ok = await itemService.deleteItemChange(itemChangesId);
        res.status(200).json(Boolean(ok));
    })
);

// Delete item data (soft delete)
router.post(
    '/auth/v1/delete/:itemDataId',
    authenticate,
    asyncHandler(async (req, res) => {
        const itemDataId = parseInt(req.params.itemDataId, 10);
        const updated = await itemService.updateItemData({ id: itemDataId, deleted: true }, req.user?.userId);
        res.status(200).json(Boolean(updated));
    })
);

// Toggle lock for item
router.put(
    '/auth/v1/toggle-lock/:itemId',
    authenticate,
    asyncHandler(async (req, res) => {
        const itemId = parseInt(req.params.itemId, 10);
        const locked = req.body === true || req.body === 'true' || req.body?.locked === true;
        const updated = await itemService.updateItemData({ id: itemId, locked }, req.user?.userId);
        res.status(200).json(Boolean(updated));
    })
);

// Update item change
router.put(
    '/auth/v1/item-change',
    authenticate,
    asyncHandler(async (req, res) => {
        const updated = await itemService.updateItemChange(req.body);
        res.status(200).json(updated);
    })
);

// PUT /api/toggle-online/:id
router.put(
    '/toggle-online/:id',
    asyncHandler(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const itemData = req.body || {};
        if (!itemData || isNaN(id)) return res.status(400).json({ error: 'Invalid request' });
        itemData.id = id;
        await itemService.toggleOnline(itemData);
        res.status(200).json(itemData);
    })
);

router.get(
    '/auth/item-data-history',
    authenticate,
    asyncHandler(async (req, res) => {
        const history = await itemService.getItemMetadataHistory();

        if (!history || history.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(history);
    })
);

router.post(
    '/auth/item-data',
    authenticate,
    asyncHandler(async (req, res) => {
        const username = req.user?.userId;
        const created = await itemService.createItemData(req.body, username);

        if (!created) {
            return res.status(204).send();
        }

        res.status(201).json(created);
    })
);

router.put(
    '/auth/item-data',
    authenticate,
    asyncHandler(async (req, res) => {
        const username = req.user?.userId;
        const updated = await itemService.updateItemData(req.body, username);

        if (!updated) {
            return res.status(204).send();
        }

        res.status(200).json(updated);
    })
);

export default router;

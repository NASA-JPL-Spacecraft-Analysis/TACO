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

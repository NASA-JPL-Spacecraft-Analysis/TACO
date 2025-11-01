import express from 'express';
import * as itemService from './item.service.js';
import { asyncHandler } from '../middleware/error.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const getItemDataHandler = asyncHandler(async (req, res) => {
    const testbedId = parseInt(req.params.testbedId, 10);
    const itemDataMap = await itemService.getItemDataMap(testbedId);

    console.log('itemDataMap', itemDataMap);

    // If map is empty, fallback to raw item metadata list for this testbed
    const isEmptyMap = !itemDataMap || (itemDataMap instanceof Map && itemDataMap.size === 0) || (typeof itemDataMap === 'object' && Object.keys(itemDataMap).length === 0);
    if (isEmptyMap) {
        const metaList = await itemService.getItemMetadata(testbedId);
        if (metaList && metaList.length > 0) {
            return res.status(200).json(metaList);
        }
        return res.status(204).send();
    }

    const payload = itemDataMap instanceof Map
        ? Object.fromEntries(Array.from(itemDataMap.entries()))
        : itemDataMap;
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

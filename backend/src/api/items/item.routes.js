import express from 'express';
import * as itemService from './item.service.js';
import { asyncHandler } from '../middleware/error.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get(
    '/testbeds/:testbedId/item-data',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const itemDataMap = await itemService.getItemDataMap(testbedId);

        if (!itemDataMap || (typeof itemDataMap === 'object' && Object.keys(itemDataMap).length === 0)) {
            return res.status(204).send();
        }

        const payload = itemDataMap instanceof Map
            ? Object.fromEntries(Array.from(itemDataMap.entries()))
            : itemDataMap;
        res.status(200).json(payload);
    })
);

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

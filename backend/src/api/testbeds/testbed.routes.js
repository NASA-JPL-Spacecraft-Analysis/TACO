/**
 * Testbed Routes
 * Migrated from TestbedVizResource.java and AuthResource.java
 *
 * Maps Java JAX-RS @Path annotations to Express routes
 * Updated endpoints to use a modern RESTful approach
 */

import express from 'express';

import * as testbedService from './testbed.service.js';
import * as testbedRepo from './testbed.repository.js';
import * as itemService from '../items/item.service.js';
import { asyncHandler } from '../middleware/error.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/* router.get(
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
); */

/**
 * GET /api/testbeds
 * Mirrors: TestbedVizResource.getTestbeds()
 * Java: @GET @Path("/testbeds")
 */
router.get(
    '/testbeds',
    asyncHandler(async (req, res) => {
        const testbeds = await testbedService.getTestbeds();

        if (testbeds.length === 0) {
            return res.status(204).send(); // NO_CONTENT
        }

        res.status(200).json(testbeds);
    })
);

/**
 * GET /api/testbeds/:testbedId
 * Mirrors: TestbedVizResource.getTestbedById()
 * Java: @GET @Path("/testbed/{testbedId}")
 */
router.get(
    '/testbeds/:testbedId',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const testbed = await testbedService.getTestbedById(testbedId);

        if (!testbed) {
            return res.status(204).send(); // NO_CONTENT
        }

        res.status(200).json(testbed);
    })
);

/**
 * PATCH /api/testbeds/:testbedId
 * Mirrors: TestbedVizResource (PUT /testbed/{testbedId}/description)
 * Updated to use PATCH with body instead of separate endpoint
 * Java: @PUT @Path("/testbed/{testbedId}/description")
 */
router.patch(
    '/testbeds/:testbedId',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const { description } = req.body;

        if (description === undefined) {
            return res.status(400).json({ error: 'Description is required' });
        }

        const updatedDescription = await testbedService.updateTestbedDescription(testbedId, description);

        res.status(200).json({ description: updatedDescription });
    })
);

/**
 * GET /api/testbeds/:testbedId/settings
 * Mirrors: TestbedVizResource (GET /testbed-settings with filter)
 * Java: @GET @Path("/testbed-settings")
 */
router.get(
    '/testbeds/:testbedId/settings',
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const settings = await testbedService.getTestbedSettingsById(testbedId);

        if (!settings) {
            return res.status(204).send();
        }

        res.status(200).json(settings);
    })
);

/**
 * GET /api/settings
 * Get all testbed settings
 * Mirrors: TestbedVizResource (GET /testbed-settings)
 * Java: @GET @Path("/testbed-settings")
 */
router.get(
    '/settings',
    asyncHandler(async (req, res) => {
        const settings = await testbedService.getTestbedSettings();

        if (settings.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(settings);
    })
);

// ============================================================================
// ADMIN ENDPOINTS (require authentication and admin privileges)
// ============================================================================

/**
 * POST /api/testbeds
 * Create new testbed with statuses and items
 * Mirrors: TestbedVizResource (via JsonStructure)
 */
router.post(
    '/testbeds',
    authenticate,
    asyncHandler(async (req, res) => {

        const { statuses, testbedStructure } = req.body;

        const name = testbedStructure.name;
        const acronym = testbedStructure.acronym;
        const description = testbedStructure.description;
        const items = testbedStructure.items;

        if (!name || !acronym) {
            return res.status(400).json({ error: 'Name and acronym are required' });
        }

        const testbed = await testbedService.createTestbed({
            name,
            acronym,
            description,
            statuses,
            items
        });

        res.status(201).json(testbed);
    })
);

/**
 * PUT /api/testbeds/:testbedId/settings
 * Update testbed settings (admin only)
 * Mirrors: AuthResource.putTestbedSettings()
 * Java: @PUT @Path("/auth/v1/testbed-settings")
 */
router.put(
    '/testbeds/:testbedId/settings',
    authenticate,
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const username = req.user.userId; // From auth middleware

        const settings = await testbedService.updateTestbedSettings(testbedId, req.body, username);

        res.status(200).json(settings);
    })
);

/**
 * POST /api/testbeds/:testbedId/statuses
 * Create item status for testbed (admin only)
 * Mirrors: AuthResource.postItemStatus()
 * Java: @POST @Path("/auth/v1/item-status")
 */
router.post(
    '/testbeds/:testbedId/statuses',
    authenticate,
    asyncHandler(async (req, res) => {
        const testbedId = parseInt(req.params.testbedId, 10);
        const { status, color, sortOrder } = req.body;

        if (!status || !color) {
            return res.status(400).json({ error: 'Status and color are required' });
        }

        const createdStatus = await testbedRepo.createItemStatus(testbedId, {
            status,
            color,
            sortOrder
        });

        res.status(201).json(createdStatus);
    })
);

/**
 * PUT /api/testbeds/:testbedId/statuses/:statusId
 * Update item status (admin only)
 * Mirrors: AuthResource.putItemStatus()
 * Java: @PUT @Path("/auth/v1/item-status")
 */
router.put(
    '/testbeds/:testbedId/statuses/:statusId',
    authenticate,
    asyncHandler(async (req, res) => {
        const statusId = parseInt(req.params.statusId, 10);
        const { status, color, sortOrder } = req.body;

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (color !== undefined) updateData.color = color;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

        const updatedStatus = await testbedRepo.updateItemStatus(statusId, updateData);

        res.status(200).json(updatedStatus);
    })
);

export default router;

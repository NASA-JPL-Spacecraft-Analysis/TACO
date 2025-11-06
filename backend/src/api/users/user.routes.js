/**
 * User Routes
 * RESTful API endpoints for user information and permissions
 *
 * Migrated from: testbed-viz/src/main/java/gov/nasa/jpl/clipper/TestbedVizResource.java
 */

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as testbedService from '../testbeds/testbed.service.js';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current authenticated user information
 *
 * TODO: Implement using userService.getUser(req)
 *
 * Response: User object with userId, fullName, groupList, filteredGroupList
 */
router.get('/me', authenticate, (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        res.status(200).json(req.user);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/users/me/admin
 * Check if current user has admin privileges
 *
 * TODO: Implement using userService.isAdmin(req.user)
 *
 * Response: { isAdmin: boolean }
 */
router.get('/me/admin', authenticate, (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        const adminGroup = process.env.ADMIN_GROUP || 'testbed-admins';
        const isAdmin = Array.isArray(req.user.groupList) && req.user.groupList.includes(adminGroup);
        res.status(200).json({ isAdmin });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/users/me/permissions/:testbedId
 * Check if current user can edit specific testbed
 *
 * TODO: Implement using userService.canUserEdit(testbedId, req.user)
 *
 * Response: { canEdit: boolean }
 */
router.get('/me/permissions/:testbedId', authenticate, async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Authentication required' });
        const testbedId = parseInt(req.params.testbedId, 10);
        const settings = await testbedService.getTestbedSettingsById(testbedId);
        const groupStr = settings?.testbedEditGroup || '';
        const editGroups = groupStr ? groupStr.split(',').map((g) => g.trim()).filter(Boolean) : [];
        const canEdit = editGroups.length === 0
            ? true
            : (Array.isArray(req.user.groupList) && req.user.groupList.some((g) => editGroups.includes(g)));
        res.status(200).json({ canEdit });
    } catch (error) {
        next(error);
    }
});

export default router;

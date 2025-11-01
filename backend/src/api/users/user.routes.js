/**
 * User Routes
 * RESTful API endpoints for user information and permissions
 *
 * Migrated from: testbed-viz/src/main/java/gov/nasa/jpl/clipper/TestbedVizResource.java
 */

import express from 'express';
import * as userService from './user.service.js';
import { authenticate } from '../middleware/auth.js';

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
        // TODO: Return user from req.user (set by authenticate middleware)
        res.status(501).json({ error: 'Not implemented' });
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
        // TODO: Call userService.isAdmin(req.user)
        res.status(501).json({ error: 'Not implemented' });
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
        const { testbedId } = req.params;
        // TODO: Call userService.canUserEdit(testbedId, req.user)
        res.status(501).json({ error: 'Not implemented' });
    } catch (error) {
        next(error);
    }
});

export default router;

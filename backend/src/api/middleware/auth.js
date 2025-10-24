import { createError } from './error.js';
import * as userService from '../users/user.service.js';

/**
 * Authentication Middleware
 *
 * TODO: Implement full authentication logic using userService
 * See: backend/src/services/user.service.js for implementation details
 *
 * Reference Java implementation:
 * - testbed-viz/src/main/java/gov/nasa/jpl/clipper/service/UserServiceImpl.java
 * - testbed-viz/src/main/java/gov/nasa/jpl/clipper/auth/
 *
 * Previously supported authentication modes (via AUTH env var):
 * - CSSO_PROXY: Extract X-Sub and X-Groups headers (Base64-encoded JSON)
 * - CAM: Validate CAM cookie against CAM service
 * - LDAP: Direct LDAP authentication
 * - NO_AUTH: Development mode (mock user)
 *
 * For now, this is a STUB that sets a mock user in development mode
 */

/**
 * Basic authentication middleware (STUB)
 *
 * TODO: Replace with userService.getUser(req) when implemented
 */
const authenticate = (req, res, next) => {
    const authMode = process.env.AUTH || 'NO_AUTH';

    if (authMode === 'NO_AUTH') {
        // Development mode - set mock user
        req.user = {
            userId: 'dev-user',
            fullName: 'Development User',
            groupList: ['developers'],
            filteredGroupList: ['developers']
        };
        next();
        return;
    }

    // TODO: Call userService.getUser(req) to extract authenticated user
    // TODO: Set req.user = user object from service

    next(createError('Authentication not implemented', 501));
};

/**
 * Admin authorization middleware
 * Checks if authenticated user is in admin group
 *
 * TODO: Replace with userService.isAdmin(req.user) when implemented
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        next(createError('Authentication required', 401));
        return;
    }

    // TODO: Call userService.isAdmin(req.user)

    // stub for NO_AUTH mode
    const adminGroup = process.env.ADMIN_GROUP || 'testbed-admins';
    if (req.user.groupList && req.user.groupList.includes(adminGroup)) {
        next();
        return;
    }

    next(createError('Admin access required', 403));
};

/**
 * Edit permission middleware for testbed
 * Checks if user can edit specific testbed based on testbed_edit_group
 *
 * TODO: Replace with userService.canUserEdit(testbedId, req.user) when implemented
 */
const canEditTestbed = (testbedEditGroup) => {
    return (req, res, next) => {
        if (!req.user) {
            next(createError('Authentication required', 401));
            return;
        }

        // TODO: Call userService.canUserEdit(testbedId, req.user)

        // Temporary stub - check if user is in edit group
        if (!testbedEditGroup || testbedEditGroup === '') {
            // No restriction, allow all
            next();
            return;
        }

        const editGroups = testbedEditGroup.split(',').map((g) => g.trim());
        const hasPermission = req.user.groupList && req.user.groupList.some((g) => editGroups.includes(g));

        if (hasPermission) {
            next();
            return;
        }

        next(createError('Insufficient permissions to edit this testbed', 403));
    };
};

export { authenticate, canEditTestbed, requireAdmin };

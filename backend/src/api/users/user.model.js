/**
 * User model
 * Represents an authenticated user in the system
 *
 * Migrated from: testbed-viz/src/main/java/gov/nasa/jpl/clipper/model/User.java
 */

/**
 * Create a new user object
 * @param {string} userId - Unique user identifier (username/sub)
 * @param {string} fullName - User's full display name
 * @param {string[]} groupList - All groups/roles the user belongs to
 * @param {string[]} filteredGroupList - Subset of groups for permission checks
 * @returns {Object} User object
 */
const createUser = (userId = '', fullName = '', groupList = [], filteredGroupList = []) => ({
    userId,
    fullName,
    groupList,
    filteredGroupList
});

/**
 * Create a User from a plain object
 * @param {Object} obj - Plain object with user properties
 * @returns {Object} User object
 */
const fromObject = (obj) => createUser(obj.userId, obj.fullName, obj.groupList || [], obj.filteredGroupList || []);

/**
 * Convert User to plain object for JSON serialization
 * @param {Object} user - User object
 * @returns {Object} Plain object
 */
const toObject = (user) => ({
    userId: user.userId,
    fullName: user.fullName,
    groupList: user.groupList,
    filteredGroupList: user.filteredGroupList
});

export { createUser, fromObject, toObject };

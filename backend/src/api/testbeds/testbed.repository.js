/**
 * Testbed Repository (Data Access Layer)
 * Migrated from:
 * - gov.nasa.jpl.clipper.testbed.dao.TestbedDaoImpl.java
 * - gov.nasa.jpl.clipper.testbed.dao.TestbedDaoQueries.java
 *
 * Replaces raw JDBC/PreparedStatements with Prisma queries
 */

import { client } from '../../db/prisma.js';
import { logger } from '../../utils/logger.js';

/**
 * Get all enabled testbeds
 * Mirrors: TestbedDaoImpl.getTestbeds()
 * Query: "select * from testbeds where enabled = '1'"
 */
const getTestbeds = async () => {
    console.log('Attempting to get testbeds');

    try {
        const prisma = client();

        return await prisma.testbed.findMany({
            where: { enabled: 1 },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }]
        });
    } catch (error) {
        logger.error('Error fetching testbeds', error);
        throw error;
    }
};

/**
 * Update testbed sort order
 */
const updateTestbedSortOrder = async (testbedId, sortOrder) => {
    try {
        const prisma = client();
        await prisma.testbed.update({ where: { id: testbedId }, data: { sortOrder } });
        return sortOrder;
    } catch (error) {
        logger.error(`Error updating testbed ${testbedId} sortOrder`, error);
        throw error;
    }
};

/**
 * Clear testbed sort order (set to null)
 */
const clearTestbedSortOrder = async (testbedId) => {
    try {
        const prisma = client();
        await prisma.testbed.update({ where: { id: testbedId }, data: { sortOrder: null } });
        return true;
    } catch (error) {
        logger.error(`Error clearing sortOrder for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Get testbed by ID
 * Mirrors: TestbedDaoImpl.getTestbedById()
 * Query: "select * from testbeds where id = ?"
 */
const getTestbedById = async (testbedId) => {
    try {
        const prisma = client();
        return await prisma.testbed.findUnique({
            where: { id: testbedId }
        });
    } catch (error) {
        logger.error(`Error fetching testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Create new testbed
 * Mirrors: TestbedDaoImpl.postTestbed()
 * Query: "insert into testbeds (name, acronym) values (?, ?)"
 * Returns created testbed with generated ID
 */
const createTestbed = async (name, acronym) => {
    try {
        const prisma = client();
        return await prisma.testbed.create({
            data: { name, acronym }
        });
    } catch (error) {
        logger.error(`Error creating testbed ${name}`, error);
        throw error;
    }
};

/**
 * Update testbed description
 * Mirrors: TestbedDaoImpl.updateTestbedDescription()
 * Query: "update testbeds set description = ? where id = ?"
 */
const updateTestbedDescription = async (testbedId, description) => {
    try {
        const prisma = client();
        await prisma.testbed.update({
            where: { id: testbedId },
            data: { description }
        });
        return description;
    } catch (error) {
        logger.error(`Error updating testbed ${testbedId} description`, error);
        throw error;
    }
};

/**
 * Get all testbed settings
 * Mirrors: TestbedDaoImpl.getTestbedSettings()
 * Query: "select * from testbed_settings"
 */
const getTestbedSettings = async () => {
    try {
        const prisma = client();
        return await prisma.testbedSettings.findMany();
    } catch (error) {
        logger.error('Error fetching testbed settings', error);
        throw error;
    }
};

/**
 * Get testbed settings by testbed ID
 * Mirrors: TestbedDaoImpl.getTestbedSettingsById()
 * Query: "select * from testbed_settings where testbed_id = ?"
 */
const getTestbedSettingsById = async (testbedId) => {
    try {
        const prisma = client();
        return await prisma.testbedSettings.findUnique({
            where: { testbedId }
        });
    } catch (error) {
        logger.error(`Error fetching settings for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Create default testbed settings
 * Mirrors: TestbedDaoImpl.postTestbedSettings()
 * Query: "insert into testbed_settings (testbed_id) values (?)"
 */
const createTestbedSettings = async (testbedId) => {
    try {
        const prisma = client();
        return await prisma.testbedSettings.create({
            data: { testbedId }
        });
    } catch (error) {
        logger.error(`Error creating settings for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Update testbed settings
 * Mirrors: AuthDaoImpl.updateTestbedSettings() (admin functionality)
 * Note: TODO
 */
const updateTestbedSettings = async (testbedId, settings) => {
    try {
        // TODO: Insert into testbed_settings_history for audit trail
        const prisma = client();
        return await prisma.testbedSettings.update({
            where: { testbedId },
            data: settings
        });
    } catch (error) {
        logger.error(`Error updating settings for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Create item statuses in batch
 * Mirrors: TestbedDaoImpl.postStatuses()
 * Query: "insert into item_status (testbed_id, status, color) values (?, ?, ?)"
 * Uses batch processing (1000 per batch)
 */
const createStatuses = async (testbedId, statuses) => {
    try {
        const prisma = client();
        const data = statuses.map((status) => ({
            testbedId,
            status: status.status,
            color: status.color,
            sortOrder: status.sortOrder
        }));

        // Prisma handles batching automatically
        await prisma.itemStatus.createMany({ data });
    } catch (error) {
        logger.error(`Error creating statuses for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Get all item statuses (for all testbeds)
 * Mirrors: ItemDaoImpl.getAllItemStatuses() pattern
 * Query: "select * from item_status"
 */
const getAllItemStatuses = async () => {
    try {
        const prisma = client();
        return await prisma.itemStatus.findMany({
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }]
        });
    } catch (error) {
        logger.error('Error fetching all item statuses', error);
        throw error;
    }
};

/**
 * Get item statuses for specific testbed
 * Mirrors: ItemDaoImpl.getItemStatus()
 * Query: "select * from item_status where testbed_id = ?"
 */
const getItemStatusesByTestbedId = async (testbedId) => {
    try {
        const prisma = client();
        return await prisma.itemStatus.findMany({
            where: { testbedId },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }]
        });
    } catch (error) {
        logger.error(`Error fetching statuses for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Create single item status
 * Mirrors: AuthServiceImpl.createItemStatus() - admin functionality
 */
const createItemStatus = async (testbedId, statusData) => {
    try {
        // TODO: Insert into item_status_history for audit trail
        const prisma = client();
        return await prisma.itemStatus.create({
            data: {
                testbedId,
                status: statusData.status,
                color: statusData.color,
                sortOrder: statusData.sortOrder
            }
        });
    } catch (error) {
        logger.error(`Error creating status for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Update item status
 * Mirrors: AuthServiceImpl.updateItemStatus() - admin functionality
 */
const updateItemStatus = async (statusId, statusData) => {
    try {
        // TODO: Insert into item_status_history for audit trail
        const prisma = client();
        return await prisma.itemStatus.update({
            where: { id: statusId },
            data: statusData
        });
    } catch (error) {
        logger.error(`Error updating status ${statusId}`, error);
        throw error;
    }
};

export {
    createItemStatus,
    createStatuses,
    createTestbed,
    createTestbedSettings,
    getAllItemStatuses,
    getItemStatusesByTestbedId,
    getTestbeds,
    getTestbedById,
    getTestbedSettings,
    getTestbedSettingsById,
    updateItemStatus,
    updateTestbedDescription,
    updateTestbedSettings,
    updateTestbedSortOrder,
    clearTestbedSortOrder
};

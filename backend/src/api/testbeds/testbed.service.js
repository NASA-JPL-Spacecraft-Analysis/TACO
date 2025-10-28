/**
 * Testbed Service (Business Logic Layer)
 * Migrated from gov.nasa.jpl.clipper.testbed.service.TestbedServiceImpl.java
 *
 * Handles business logic and orchestrates repository calls
 * Functional style - no classes
 */

import * as testbedRepo from './testbed.repository.js';
import { tinyintToBoolean, booleanToTinyint } from './testbedSettings.model.js';
import { DEFAULT_ABSENT_STATUS } from './itemStatus.model.js';
import { logger } from '../../utils/logger.js';

/**
 * Get all testbeds with their statuses
 * Mirrors: TestbedServiceImpl.getTestbeds()
 *
 */
const getTestbeds = async () => {
    try {
        const testbeds = await testbedRepo.getTestbeds();
        const allStatuses = await testbedRepo.getAllItemStatuses();

        console.log("trying to print testbeds");
        console.log(testbeds);
        console.log("after print")

        // Group statuses by testbedId
        const statusesByTestbedId = new Map();
        allStatuses.forEach((status) => {
            const existing = statusesByTestbedId.get(status.testbedId) || [];
            existing.push({
                id: status.id,
                testbedId: status.testbedId,
                status: status.status,
                color: status.color,
                sortOrder: status.sortOrder
            });

            statusesByTestbedId.set(status.testbedId, existing);
        });

        console.log(allStatuses);

        // Map testbeds and add statuses (including default "Not Present/Absent")
        return testbeds.map((testbed) => {

            const { id, name, acronym, description, sortOrder, enabled } = testbed;
            const statuses = statusesByTestbedId.get(id) || [];

            // Add default "Not Present/Absent" status
            statuses.push({
                ...DEFAULT_ABSENT_STATUS,
                testbedId: id
            });

            console.log({
                id,
                name,
                acronym,
                description,
                sortOrder,
                enabled,
                statuses
            }

            );

            return {
                id,
                name,
                acronym,
                description,
                sortOrder,
                enabled,
                statuses
            };
        });


    } catch (error) {
        logger.error('Error in getTestbeds service', error);
        throw error;
    }
};

/**
 * Get testbed by ID with items and statuses
 * Mirrors: TestbedServiceImpl.getTestbedById()
 *
 */
const getTestbedById = async (testbedId) => {
    try {
        const testbed = await testbedRepo.getTestbedById(testbedId);

        if (!testbed) {
            return null;
        }

        // TODO: Get items via ItemService when Item module is migrated
        // Java: testbed.setItems(itemService.getItemData(testbedId, null))
        const { id, name, acronym, description, sortOrder, enabled } = testbed;
        const statuses = await testbedRepo.getItemStatusesByTestbedId(id);

        return {
            id,
            name,
            acronym,
            description,
            sortOrder,
            enabled,
            statuses: statuses.map((s) => ({
                id: s.id,
                testbedId: s.testbedId,
                status: s.status,
                color: s.color,
                sortOrder: s.sortOrder
            })),
            items: [] // TODO: Populate when Item module is migrated
        };
    } catch (error) {
        logger.error(`Error in getTestbedById service for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Create new testbed with statuses and items
 * Mirrors: TestbedServiceImpl.postTestbed()
 *
 *  TODO: Implement more when Item module is migrated
 */
const createTestbed = async (request) => {
    try {
        // 1. Create testbed
        const testbed = await testbedRepo.createTestbed(request.name, request.acronym);

        // 2. Create default settings
        await testbedRepo.createTestbedSettings(testbed.id);

        // 3. Create statuses if provided
        if (request.statuses && request.statuses.length > 0) {
            await testbedRepo.createStatuses(testbed.id, request.statuses);
        }

        // 4. TODO: Create items via ItemService when Item module is migrated
        // Java: itemService.postItems(testbed.getId(), jsonStructure.getTestbedStructure().getItems())

        // Return created testbed with statuses
        return await getTestbedById(testbed.id);
    } catch (error) {
        logger.error('Error in createTestbed service', error);
        throw error;
    }
};

/**
 * Update testbed description
 * Mirrors: TestbedServiceImpl.putTestbedDescription()
 */
const updateTestbedDescription = async (testbedId, description) => {
    try {
        return await testbedRepo.updateTestbedDescription(testbedId, description);
    } catch (error) {
        logger.error(`Error in updateTestbedDescription for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Get all testbed settings
 * Mirrors: TestbedServiceImpl.getTestbedSettings()
 */
const getTestbedSettings = async () => {
    try {
        const settings = await testbedRepo.getTestbedSettings();

        // Convert tinyint to boolean for boolean fields
        return settings.map((s) => ({
            id: s.id,
            testbedId: s.testbedId,
            emailNotificationsList: s.emailNotificationsList,
            recentlyChangedIndicatorEnabled: tinyintToBoolean(s.recentlyChangedIndicatorEnabled),
            recentlyChangedIndicatorDays: s.recentlyChangedIndicatorDays,
            testbedEditGroup: s.testbedEditGroup,
            autoRefreshEnabled: tinyintToBoolean(s.autoRefreshEnabled),
            autoRefreshInterval: s.autoRefreshInterval
        }));
    } catch (error) {
        logger.error('Error in getTestbedSettings service', error);
        throw error;
    }
};

/**
 * Get testbed settings by ID
 * Mirrors: TestbedServiceImpl.getTestbedSettingsById()
 *
 */
const getTestbedSettingsById = async (testbedId) => {
    try {
        let settings = await testbedRepo.getTestbedSettingsById(testbedId);

        // Auto-create settings if they don't exist (Java line 86-88)
        if (!settings) {
            settings = await testbedRepo.createTestbedSettings(testbedId);
        }
        const {
            id,
            testbedId,
            emailNotificationsList,
            recentlyChangedIndicatorDays,
            recentlyChangedIndicatorEnabled,
            testbedEditGroup,
            autoRefreshEnabled,
            autoRefreshInterval
        } = settings;

        return {
            id,
            testbedId,
            emailNotificationsList,
            recentlyChangedIndicatorEnabled: tinyintToBoolean(recentlyChangedIndicatorEnabled),
            recentlyChangedIndicatorDays,
            testbedEditGroup,
            autoRefreshEnabled: tinyintToBoolean(autoRefreshEnabled),
            autoRefreshInterval
        };
    } catch (error) {
        logger.error(`Error in getTestbedSettingsById for testbed ${testbedId}`, error);
        throw error;
    }
};

/**
 * Update testbed settings
 * Mirrors: AuthServiceImpl.updateTestbedSettings() (admin functionality)
 */
const updateTestbedSettings = async (testbedId, request, username) => {
    try {
        // Convert booleans to tinyint for database
        const updateData = {};

        if (request.emailNotificationsList !== undefined) {
            updateData.emailNotificationsList = request.emailNotificationsList;
        }
        if (request.recentlyChangedIndicatorEnabled !== undefined) {
            updateData.recentlyChangedIndicatorEnabled = booleanToTinyint(request.recentlyChangedIndicatorEnabled);
        }
        if (request.recentlyChangedIndicatorDays !== undefined) {
            updateData.recentlyChangedIndicatorDays = request.recentlyChangedIndicatorDays;
        }
        if (request.testbedEditGroup !== undefined) {
            updateData.testbedEditGroup = request.testbedEditGroup;
        }
        if (request.autoRefreshEnabled !== undefined) {
            updateData.autoRefreshEnabled = booleanToTinyint(request.autoRefreshEnabled);
        }
        if (request.autoRefreshInterval !== undefined) {
            updateData.autoRefreshInterval = request.autoRefreshInterval;
        }

        // TODO: Insert into testbed_settings_history with username for audit trail

        const settings = await testbedRepo.updateTestbedSettings(testbedId, updateData);
        const {
            id,
            testbedId,
            emailNotificationsList,
            recentlyChangedIndicatorDays,
            recentlyChangedIndicatorEnabled,
            testbedEditGroup,
            autoRefreshEnabled,
            autoRefreshInterval
        } = settings;

        return {
            id,
            testbedId,
            emailNotificationsList,
            recentlyChangedIndicatorEnabled: tinyintToBoolean(recentlyChangedIndicatorEnabled),
            recentlyChangedIndicatorDays,
            testbedEditGroup,
            autoRefreshEnabled: tinyintToBoolean(autoRefreshEnabled),
            autoRefreshInterval
        };
    } catch (error) {
        logger.error(`Error in updateTestbedSettings for testbed ${testbedId}`, error);
        throw error;
    }
};

// canUserEdit,
export {
    
    createTestbed,
    getTestbedById,
    getTestbeds,
    getTestbedSettings,
    getTestbedSettingsById,
    updateTestbedDescription,
    updateTestbedSettings
};

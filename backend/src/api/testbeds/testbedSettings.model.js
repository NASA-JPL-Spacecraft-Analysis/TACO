/**
 * Testbed Settings Model
 * Migrated from gov.nasa.jpl.clipper.model.TestbedSettings.java
 */

/**
 * Helper to convert tinyint (0/1) to boolean
 */
const tinyintToBoolean = (value) => {
    return value === 1;
};

/**
 * Helper to convert boolean to tinyint (0/1)
 */
const booleanToTinyint = (value) => {
    return value ? 1 : 0;
};

export { booleanToTinyint, tinyintToBoolean };

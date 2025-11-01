/**
 * Item Status Model
 * Migrated from gov.nasa.jpl.clipper.model.ItemStatus.java
 */

/**
 * Default "Not Present/Absent" status
 * Mirrors the hardcoded status in TestbedServiceImpl.java
 */
const DEFAULT_ABSENT_STATUS = {
    id: -1,
    status: 'Not Present/Absent',
    color: '#a9a9a9',
    sortOrder: null
};

export { DEFAULT_ABSENT_STATUS };

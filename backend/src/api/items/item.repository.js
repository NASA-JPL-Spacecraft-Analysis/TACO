import { client } from '../../db/prisma.js';

const getItemMetadata = async (testbedId) => {
    const prisma = client();
    const where = { deleted: 0 };
    if (typeof testbedId === 'number') where.testbedId = testbedId;
    return prisma.itemMetadata.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
};

const getItemDataById = async (itemId) => {
    const prisma = client();
    return prisma.itemMetadata.findFirst({ where: { id: itemId, deleted: 0 } });
};

const toggleOnline = async (itemData) => {
    const prisma = client();
    await prisma.itemMetadata.update({ where: { id: itemData.id }, data: { online: itemData.online ? 1 : 0 } });
};

const getItemStatus = async (testbedId) => {
    const prisma = client();
    if (testbedId == null) {
        return prisma.itemStatus.findMany({ orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
    }
    return prisma.itemStatus.findMany({ where: { testbedId }, orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }] });
};

const getItemChangesById = async (id, useItemId = false) => {
    const prisma = client();
    if (useItemId) {
        return prisma.itemChanges.findMany({ where: { itemId: id, online: 1 }, orderBy: { updated: 'desc' } });
    }
    const change = await prisma.itemChanges.findUnique({ where: { id } });
    if (!change) return [];
    return prisma.itemChanges.findMany({ where: { itemId: change.itemId, online: 1 }, orderBy: { updated: 'desc' } });
};

const getLatestItemChanges = async () => {
    const prisma = client();
    const rows = await prisma.itemChanges.findMany({ orderBy: { updated: 'desc' } });
    const seen = new Set();
    const out = [];
    for (const r of rows) {
        if (!seen.has(r.itemId)) {
            seen.add(r.itemId);
            out.push(r);
        }
    }
    return out;
};

const getHistory = async (testbedId) => {
    const prisma = client();
    const items = await prisma.itemMetadata.findMany({ where: { testbedId, deleted: 0 }, select: { id: true } });
    const itemIds = items.map((i) => i.id);
    if (itemIds.length === 0) return [];
    return prisma.itemChanges.findMany({ where: { itemId: { in: itemIds }, online: 1 }, orderBy: { updated: 'desc' } });
};

const getItemChangesByDateTime = async (testbedId, dateTime) => {
    const prisma = client();
    const items = await prisma.itemMetadata.findMany({ where: { testbedId, deleted: 0 }, select: { id: true } });
    const itemIds = items.map((i) => i.id);
    if (itemIds.length === 0) return [];
    return prisma.itemChanges.findMany({ where: { updated: { lt: new Date(dateTime) }, itemId: { in: itemIds } }, orderBy: { updated: 'desc' } });
};

const getItemChangesHistory = async () => {
    const prisma = client();
    return prisma.itemChanges.findMany({ orderBy: { id: 'asc' } });
};

const searchItemChangesForTestbeds = async (search, testbedIds) => {
    const prisma = client();
    const items = await prisma.itemMetadata.findMany({ where: { testbedId: { in: testbedIds }, deleted: 0 }, select: { id: true, name: true, fullname: true } });
    const itemIds = items.map((i) => i.id);
    if (itemIds.length === 0) return [];
    const like = search;
    return prisma.itemChanges.findMany({
        where: {
            itemId: { in: itemIds },
            OR: [
                { description: { contains: like } },
                { version: { contains: like } },
                { serialNumber: { contains: like } },
                { partNumber: { contains: like } },
                { username: { contains: like } },
                { rationale: { contains: like } },
                { status: { contains: like } }
            ]
        },
        orderBy: { updated: 'desc' }
    });
};

const postItemChange = async (itemId, itemChanges) => {
    const prisma = client();
    const created = await prisma.itemChanges.create({
        data: {
            itemId,
            status: itemChanges.status,
            description: itemChanges.description,
            version: itemChanges.version,
            serialNumber: itemChanges.serialNumber,
            partNumber: itemChanges.partNumber,
            username: itemChanges.username,
            rationale: itemChanges.rationale,
            online: 1,
            image: itemChanges.image ? 1 : 0
        }
    });
    return created.id;
};

const postItemChanges = async (changes) => {
    const prisma = client();
    if (!changes || changes.length === 0) return;
    await prisma.itemChanges.createMany({ data: changes.map((c) => ({ itemId: c.itemId, username: c.username, rationale: c.rationale })) });
};

const postItems = async (testbedId, itemStructures) => {
    const prisma = client();
    const insertOne = async (item, parentId = null) => {
        const created = await prisma.itemMetadata.create({
            data: {
                testbedId,
                parentId,
                name: item.name,
                fullname: item.fullname
            }
        });
        if (item.children && item.children.length > 0) {
            for (const child of item.children) {
                await insertOne(child, created.id);
            }
        }
        return created.id;
    };
    for (const it of itemStructures) {
        await insertOne(it, null);
    }
};

const deleteItemChange = async (itemChangesId) => {
    const prisma = client();
    await prisma.itemChanges.delete({ where: { id: itemChangesId } });
    return true;
};

const updateItemChange = async (itemChange) => {
    const prisma = client();
    const data = {};
    if (itemChange.status !== undefined) data.status = itemChange.status;
    if (itemChange.description !== undefined) data.description = itemChange.description;
    if (itemChange.version !== undefined) data.version = itemChange.version;
    if (itemChange.serialNumber !== undefined) data.serialNumber = itemChange.serialNumber;
    if (itemChange.partNumber !== undefined) data.partNumber = itemChange.partNumber;
    if (itemChange.username !== undefined) data.username = itemChange.username;
    if (itemChange.rationale !== undefined) data.rationale = itemChange.rationale;
    if (itemChange.online !== undefined) data.online = itemChange.online ? 1 : 0;
    if (itemChange.image !== undefined) data.image = itemChange.image ? 1 : 0;
    await prisma.itemChanges.update({ where: { id: itemChange.id }, data });
    return prisma.itemChanges.findUnique({ where: { id: itemChange.id } });
};

const searchItemChanges = async (searchMap) => {
    const prisma = client();
    const where = { OR: [] };
    for (const [key, value] of Object.entries(searchMap)) {
        if (key === 'name') {
            const items = await prisma.itemMetadata.findMany({ where: { name: { contains: value } }, select: { id: true } });
            const itemIds = items.map((i) => i.id);
            if (itemIds.length > 0) where.OR.push({ itemId: { in: itemIds } });
        } else {
            where.OR.push({ [key]: { contains: value } });
        }
    }
    if (where.OR.length === 0) return [];
    return prisma.itemChanges.findMany({ where, orderBy: { updated: 'desc' } });
};

const updateItemDescription = async (itemId, description) => {
    const prisma = client();
    await prisma.itemMetadata.update({ where: { id: itemId }, data: { description } });
    return description;
};

const getItemMetadataHistory = async () => {
    try {
        const prisma = client();
        // Some deployments may not have this history table modeled; return empty on failure
        return await prisma.itemMetadataHistory.findMany({ orderBy: { id: 'asc' } });
    } catch (e) {
        return [];
    }
};

const createItemData = async (itemData, username) => {
    const prisma = client();
    const created = await prisma.itemMetadata.create({
        data: {
            name: itemData.name,
            fullname: itemData.fullname,
            sortOrder: itemData.sortOrder ?? null,
            parentId: itemData.parentId ?? null,
            testbedId: itemData.testbedId,
            online: 1,
            deleted: 0,
            locked: itemData.locked ? 1 : 0,
            description: itemData.description ?? null
        }
    });
    return created;
};

const updateItemData = async (itemData, username) => {
    const prisma = client();
    const data = {};
    if (itemData.name !== undefined) data.name = itemData.name;
    if (itemData.fullname !== undefined) data.fullname = itemData.fullname;
    if (itemData.sortOrder !== undefined) data.sortOrder = itemData.sortOrder;
    if (itemData.parentId !== undefined) data.parentId = itemData.parentId;
    if (itemData.description !== undefined) data.description = itemData.description;
    if (itemData.online !== undefined) data.online = itemData.online ? 1 : 0;
    if (itemData.locked !== undefined) data.locked = itemData.locked ? 1 : 0;
    if (itemData.deleted !== undefined) data.deleted = itemData.deleted ? 1 : 0;
    return prisma.itemMetadata.update({ where: { id: itemData.id }, data });
};

export {
    createItemData,
    getHistory,
    getItemChangesHistory,
    getItemChangesByDateTime,
    getItemChangesById,
    getItemMetadata,
    getItemMetadataHistory,
    getItemStatus,
    getItemDataById,
    getLatestItemChanges,
    postItemChange,
    postItemChanges,
    postItems,
    deleteItemChange,
    updateItemChange,
    searchItemChanges,
    searchItemChangesForTestbeds,
    toggleOnline,
    updateItemData,
    updateItemDescription
};

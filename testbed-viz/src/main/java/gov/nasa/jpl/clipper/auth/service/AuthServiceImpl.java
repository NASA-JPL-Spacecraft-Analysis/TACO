package gov.nasa.jpl.clipper.auth.service;

import gov.nasa.jpl.clipper.auth.dao.AuthDao;
import gov.nasa.jpl.clipper.auth.dao.AuthDaoImpl;
import gov.nasa.jpl.clipper.dao.ItemDao;
import gov.nasa.jpl.clipper.dao.ItemDaoImpl;
import gov.nasa.jpl.clipper.model.*;

import java.util.List;

public class AuthServiceImpl implements AuthService {
    private final AuthDao authDao;
    private final ItemDao itemDao;

    public AuthServiceImpl() {
        authDao = new AuthDaoImpl();
        itemDao = new ItemDaoImpl();
    }

    @Override
    public ItemData createItemData(ItemData itemData, String username) {
        return authDao.createItemData(itemData, username);
    }

    public ItemStatus createItemStatus(ItemStatus itemStatus, String username) {
        return authDao.createItemStatus(itemStatus, username);
    }

    @Override
    public List<ItemChangesHistory> getItemChangesHistory() {
        return authDao.getItemChangesHistory();
    }

    @Override
    public List<ItemMetadataHistory> getItemMetadataHistory() {
        return authDao.getItemMetadataHistory();
    }

    @Override
    public boolean deleteItemChanges(ItemChanges itemChanges, String username) {
        return authDao.deleteItemChanges(itemChanges, username);
    }

    @Override
    public boolean updateDeleted(boolean deleted, ItemData itemData, String username) {
        itemData.setDeleted(deleted);

        return authDao.updateDeleted(itemData, username);
    }

    @Override
    public ItemChanges updateItemChanges(ItemChanges itemChanges, String username) {
        ItemChanges oldItemChanges = itemDao.getItemChangesById(itemChanges.getId());

        itemChanges.setOnline(oldItemChanges.getOnline());

        return authDao.updateItemChanges(itemChanges, username);
    }

    @Override
    public ItemData updateItemData(ItemData itemData, String username) {
        return authDao.updateItemData(itemData, username);
    }

    @Override
    public ItemStatus updateItemStatus(ItemStatus itemStatus, String username) {
        return authDao.updateItemStatus(itemStatus, username);
    }

    @Override
    public boolean updateLocked(boolean locked, ItemData itemData, String username) {
        itemData.setLocked(locked);

        return authDao.updateLocked(itemData, username);
    }

    @Override
    public Integer updateSortOrder(Integer sortOrder, int testbedId) {
        return authDao.updateSortOrder(sortOrder, testbedId);
    }

    @Override
    public TestbedSettings updateTestbedSettings(TestbedSettings testbedSettings, String username) {
        return authDao.updateTestbedSettings(testbedSettings, username);
    }
}

package gov.nasa.jpl.clipper.auth.service;

import gov.nasa.jpl.clipper.model.*;

import java.util.List;


public interface AuthService {
    ItemData createItemData(ItemData itemData, String username);

    ItemStatus createItemStatus(ItemStatus itemStatus, String username);
  
    List<ItemChangesHistory> getItemChangesHistory();

    List<ItemMetadataHistory> getItemMetadataHistory();

    boolean deleteItemChanges(ItemChanges itemChanges, String username);

    boolean updateDeleted(boolean deleted, ItemData itemData, String username);

    ItemChanges updateItemChanges(ItemChanges itemChanges, String username);

    ItemData updateItemData(ItemData itemData, String username);

    ItemStatus updateItemStatus(ItemStatus itemStatus, String username);

    boolean updateLocked(boolean locked, ItemData itemData, String username);

    Integer updateSortOrder(Integer sortOrder, int testbedId);

    TestbedSettings updateTestbedSettings(TestbedSettings testbedSettings, String Username);
}

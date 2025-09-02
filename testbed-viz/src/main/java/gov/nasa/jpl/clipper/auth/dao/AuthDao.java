package gov.nasa.jpl.clipper.auth.dao;

import gov.nasa.jpl.clipper.model.*;

import java.util.List;

public interface AuthDao {
    ItemData createItemData(ItemData itemData, String username);

    ItemStatus createItemStatus(ItemStatus itemStatus, String username);

    boolean deleteItemChanges(ItemChanges itemChanges, String username);
  
    List<ItemChangesHistory> getItemChangesHistory();

    List<ItemMetadataHistory> getItemMetadataHistory();

    boolean updateDeleted(ItemData itemData, String username);

    ItemChanges updateItemChanges(ItemChanges itemChanges, String username);

    ItemData updateItemData(ItemData itemData, String username);

    ItemStatus updateItemStatus(ItemStatus itemStatus, String username);

    boolean updateLocked(ItemData itemData, String username);

    Integer updateSortOrder(Integer sortOrder, int testbedId);

    TestbedSettings updateTestbedSettings(TestbedSettings testbedSettings, String username);
}

package gov.nasa.jpl.clipper.dao;

import gov.nasa.jpl.clipper.model.*;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

public interface ItemDao {
    ItemChanges getItemChangesById(int id);
    List<ItemChanges> getItemChangesById(int itemId, boolean useItemId);
    List<ItemChanges> getLatestItemChanges();
    InputStream getImage(int itemChangeId);
    List<ItemChanges> getItemChangesByDateTime(int testbedId, String dateTime);
    List<ItemChanges> getHistory(int testbedId);
    List<ItemChanges> searchItemChangesForTestbeds(String search, List<Integer> testbedIds);

    List<ItemData> getItemMetadata();
    List<ItemData> getItemMetadata(int testbedId);
    ItemData getItemDataById(int itemId);
    void toggleOnline(ItemData itemData);

    /**
     * Returns a list of item statuses. If a null testbedId is passes, returns ALL item statuses in the DB.
     * @param testbedId
     * @return
     */
    List<ItemStatus> getItemStatus(Integer testbedId);

    int postItemChange(int itemId, ItemChanges itemChanges);
    void postItemChanges(List<ItemChanges> itemChangesList);

    void postItems(int testbedId, List<ItemStructure> itemStructures);

    List<ItemChanges> searchItemChanges(Map<String, String> searchValueMap);

    void saveImage(int itemChangeId, InputStream inputStream);

    String updateItemDescription(String description, int itemId);
}

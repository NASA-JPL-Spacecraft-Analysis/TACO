package gov.nasa.jpl.clipper.service;

import gov.nasa.jpl.clipper.model.*;

import javax.ws.rs.core.UriInfo;
import java.util.List;
import java.util.Map;

public interface ItemService {
    List<Comparison> getComparison(int testbedId, String oldDate, String newDate);

    Map<Integer, Map<Integer, ItemData>> getItemDataMap();
    Map<Integer, ItemData> getItemDataMap(int testbedId);

    ItemChanges getItemChangesById(int id);
    List<ItemChanges> getItemChangesByItemId(int itemId);
    List<ItemChanges> getLatestItemChanges();
    List<ItemChanges> getItemChanges(int testbedId);
    List<ItemChanges> searchItemChangesForTestbeds(String search, List<Integer> testbedIds);

    ItemData getItemDataById(int itemId);
    List<ItemData> getItemData(int testbedId, List<ItemChanges> history);
    List<ItemData> getItemMetadata(int testbedId);
    List<ItemData> getItemMetadataWithIds(Integer testbedId, List<Integer> itemIdList);
    List<ItemData> getSnapshot(int testbedId);
    List<ItemData> getSnapshot(int testbedId, String dateTime);
    void toggleOnline(ItemData itemData);

    Map<Integer, List<ItemStatus>> getAllItemStatuses();
    List<ItemStatus> getItemStatus(int testbedId);

    ItemChanges postItemChange(int itemId, ItemChanges itemChanges);

    void postItems(int testbedId, List<ItemStructure> itemStructures);

    List<ItemChanges> searchItemChanges(UriInfo uriInfo);

    String putItemDescription(String description, int itemId);
}

package gov.nasa.jpl.clipper.service;

import com.google.common.base.CaseFormat;
import gov.nasa.jpl.clipper.dao.ItemDao;
import gov.nasa.jpl.clipper.dao.ItemDaoImpl;
import gov.nasa.jpl.clipper.model.*;
import gov.nasa.jpl.clipper.util.DatabaseUtil;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

public class ItemServiceImpl implements ItemService {
    private final ItemDao itemDao;
    private final Set<String> searchableFieldMap;
    private final SimpleDateFormat isoDateFormat;

    public ItemServiceImpl() {
        itemDao = new ItemDaoImpl();
        searchableFieldMap = new HashSet<>();

        String dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
        isoDateFormat = new SimpleDateFormat(dateFormat);

        // Setup our searchable fields.
        searchableFieldMap.add("description");
        searchableFieldMap.add("name");
        searchableFieldMap.add("partNumber");
        searchableFieldMap.add("rationale");
        searchableFieldMap.add("serialNumber");
        searchableFieldMap.add("status");
        searchableFieldMap.add("username");
        searchableFieldMap.add("version");
    }

    /**
     * Looks at the history from 2 distinct points in time, and finds the differences between them.
     *
     * @param testbedId The testbedId that we're looking at.
     * @param firstDateString The first point in time.
     * @param secondDateString The second point in time.
     * @return A list of all the differences.
     */
    public List<Comparison> getComparison(int testbedId, String firstDateString, String secondDateString) {
        List<Comparison> comparisonList = new ArrayList<>();

        try {
            Date parsedFirstDate = isoDateFormat.parse(firstDateString);
            Date parsedSecondDate = isoDateFormat.parse(secondDateString);
            List<ItemChanges> newestHistory;
            List<ItemChanges> oldestHistory;

            // Get the list of both histories so we can compare them to each-other.
            if (parsedFirstDate.before(parsedSecondDate)) {
                oldestHistory = itemDao.getItemChangesByDateTime(testbedId, DatabaseUtil.convertDateToMysqlDate(isoDateFormat.parse(firstDateString)));
                newestHistory = itemDao.getItemChangesByDateTime(testbedId, DatabaseUtil.convertDateToMysqlDate(isoDateFormat.parse(secondDateString)));
            } else {
                newestHistory = itemDao.getItemChangesByDateTime(testbedId, DatabaseUtil.convertDateToMysqlDate(isoDateFormat.parse(firstDateString)));
                oldestHistory = itemDao.getItemChangesByDateTime(testbedId, DatabaseUtil.convertDateToMysqlDate(isoDateFormat.parse(secondDateString)));
            }

            // Get the map of our items so we can get the item names.
            Map<Integer, ItemData> itemDataMap = getItemDataMap(testbedId);
            Map<Integer, ItemChanges> oldestHistoryMap = new HashMap<>();

            // Map our oldest changes to compare against our newer changes.
            for (ItemChanges itemChanges: oldestHistory) {
                oldestHistoryMap.put(itemChanges.getItemId(), itemChanges);
            }

            /*
             * Look through our newest changes list, if:
             * We don't see an item in our oldest map, add all of that change's properties as missing
             * OR compare each property and see if it changed.
             */
            for (ItemChanges itemChanges: newestHistory) {
                if (oldestHistoryMap.get(itemChanges.getItemId()) == null) {
                    comparisonList.addAll(findDifferences(itemChanges, null, itemDataMap.get(itemChanges.getItemId()).getName()));

                    // After we've created all the comparisons, remove that change from the map.
                    // firstItemChangesMap.remove(itemChanges.getItemId());
                } else {
                    ItemChanges olderItemChange = oldestHistoryMap.get(itemChanges.getItemId());

                    // If our items aren't equal, compare each property.
                    if (!itemChanges.equals(olderItemChange)) {
                        comparisonList.addAll(findDifferences(itemChanges, olderItemChange, itemDataMap.get(itemChanges.getItemId()).getName()));
                    }
                }
            }
        } catch (ParseException e) {
            return null;
        }

        return comparisonList;
    }

    @Override
    public Map<Integer, Map<Integer, ItemData>> getItemDataMap() {
        Map<Integer, Map<Integer, ItemData>> itemDataMap = new HashMap<>();
        List<ItemData> itemList = itemDao.getItemMetadata();

        for (ItemData itemData: itemList) {
            itemDataMap.computeIfAbsent(itemData.getTestbedId(), k -> new HashMap<>());

            itemDataMap.get(itemData.getTestbedId()).put(itemData.getId(), itemData);
        }

        return itemDataMap;
    }

    @Override
    public Map<Integer, ItemData> getItemDataMap(int testbedId) {
        return mapItemData(testbedId);
    }

    @Override
    public ItemChanges getItemChangesById(int id) {
        return itemDao.getItemChangesById(id);
    }

    @Override
    public List<ItemChanges> getItemChangesByItemId(int itemId) {
        return itemDao.getItemChangesById(itemId, true);
    }

    @Override
    public List<ItemChanges> getLatestItemChanges() {
        return itemDao.getLatestItemChanges();
    }

    @Override
    public List<ItemData> getItemMetadata(int testbedId) {
        return itemDao.getItemMetadata(testbedId);
    }

    @Override
    public List<ItemData> getItemMetadataWithIds(Integer testbedId, List<Integer> itemIdList) {
        List<ItemData> foundItemList = new ArrayList<>();
        List<ItemData> itemDataList = getItemMetadata(testbedId);
        Map<Integer, ItemData> itemMetadataMap = mapItemData(testbedId);

        if (itemIdList.size() > 0) {
            for (int id: itemIdList) {
                foundItemList.add(itemMetadataMap.get(id));
            }
        } else {
            foundItemList = itemDataList;
        }

        return foundItemList;
    }

    @Override
    public List<ItemChanges> searchItemChangesForTestbeds(String search, List<Integer> testbedIds) {
        if(testbedIds.size() == 0) return new ArrayList<>();
        return itemDao.searchItemChangesForTestbeds(search, testbedIds);
    }

    @Override
    public List<ItemData> getSnapshot(int testbedId) {
        return getItemData(testbedId, null);
    }

    @Override
    public List<ItemData> getSnapshot(int testbedId, String dateTime) {
        try {
            Date date = isoDateFormat.parse(dateTime);

            List<ItemChanges> history = itemDao.getItemChangesByDateTime(testbedId, DatabaseUtil.convertDateToMysqlDate(date));

            return getItemData(testbedId, history);
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    public void toggleOnline(ItemData itemData) {
        itemDao.toggleOnline(itemData);
    }

    @Override
    public ItemData getItemDataById(int itemId) {
        List<ItemChanges> itemChangesList = getItemChangesByItemId(itemId);
        ItemData itemData = itemDao.getItemDataById(itemId);

        if (itemChangesList.size() > 0) {
            itemData.setLatestChange(itemChangesList.get(0));
        }

        return itemData;
    }

    @Override
    public List<ItemData> getItemData(int testbedId, List<ItemChanges> history) {
        List<ItemData> itemDataList = getItemMetadata(testbedId);
        Map<Integer, ItemData> itemMetadataMap = new HashMap<>();
        List<ItemData> rootItemDataList = new ArrayList<>();
        ItemData parentItemData;

        if (history == null) {
            history = getLatestItemChanges();
        }

        // Map all our values.
        for (ItemData itemData: itemDataList) {
            itemMetadataMap.put(itemData.getId(), itemData);

            // The element without a parent id is the root of our tree.
            if (itemData.getParentId() == null) {
                rootItemDataList.add(itemData);
            }
        }

        // Apply latest change to each item.
        for (ItemChanges itemChanges: history) {
            if (itemMetadataMap.get(itemChanges.getItemId()) != null) {
                itemMetadataMap.get(itemChanges.getItemId()).setLatestChange(itemChanges);
            }
        }

        for (ItemData itemData : itemDataList) {
            if (itemData.getParentId() != null) {
                parentItemData = itemMetadataMap.get(itemData.getParentId());

                // If we haven't made a children list, create it and add the child.
                if (parentItemData.getChildren() == null) {
                    parentItemData.setChildren(new ArrayList<>());
                }

                parentItemData.getChildren().add(itemData);
            }
        }

        return rootItemDataList;
    }

    @Override
    public List<ItemChanges> getItemChanges(int testbedId) {
        return itemDao.getHistory(testbedId);
    }

    @Override
    public ItemChanges postItemChange(int itemId, ItemChanges itemChanges) {
        ItemData itemData = itemDao.getItemDataById(itemId);

        // Only save a change if the item isn't locked.
        if (!itemData.getLocked()) {
            int id = itemDao.postItemChange(itemId, itemChanges);

            if (id != -1) {
                return itemDao.getItemChangesById(id);
            }
        }

        return null;
    }

    @Override
    public Map<Integer, List<ItemStatus>> getAllItemStatuses() {
        Map<Integer, List<ItemStatus>> testbedIdToItemStatusListMap = new HashMap<>();
        List<ItemStatus> itemStatusList = itemDao.getItemStatus(null);

        for (ItemStatus itemStatus: itemStatusList) {
            int testbedId = itemStatus.getTestbedId();

            if (testbedIdToItemStatusListMap.get(testbedId) == null) {
                testbedIdToItemStatusListMap.put(testbedId, new ArrayList<>());
            }

            testbedIdToItemStatusListMap.get(testbedId).add(itemStatus);
        }

        return testbedIdToItemStatusListMap;
    }

    @Override
    public List<ItemStatus> getItemStatus(int testbedId) {
        return itemDao.getItemStatus(testbedId);
    }

    @Override
    public void postItems(int testbedId, List<ItemStructure> itemStructures) {
        itemDao.postItems(testbedId, itemStructures);

        // Get the list of items that were just created.
        List<ItemData> createdItemsList = itemDao.getItemMetadata(testbedId);
        List<ItemChanges> itemChangesList = new ArrayList<>();

        for (ItemData itemData: createdItemsList) {
            ItemChanges itemChanges = new ItemChanges();

            itemChanges.setItemId(itemData.getId());
            itemChanges.setUsername("System");
            itemChanges.setRationale("Initial value upload");

            itemChangesList.add(itemChanges);
        }

        itemDao.postItemChanges(itemChangesList);
    }

    private Map<Integer, ItemData> mapItemData(int testbedId) {
        List<ItemData> itemDataList = getItemMetadata(testbedId);
        List<ItemChanges> itemChangesList = getLatestItemChanges();
        Map<Integer, ItemData> itemDataMap = new HashMap<>();

        // Map all our values.
        for (ItemData itemData : itemDataList) {
            itemDataMap.put(itemData.getId(), itemData);
        }

        // Apply latest change to each item.
        for (ItemChanges itemChanges : itemChangesList) {
            if (itemDataMap.get(itemChanges.getItemId()) != null) {
                itemDataMap.get(itemChanges.getItemId()).setLatestChange(itemChanges);
            }
        }

        return itemDataMap;
    }

    @Override
    public List<ItemChanges> searchItemChanges(UriInfo uriInfo) {
        List<ItemChanges> itemChangesList = new ArrayList<>();
        MultivaluedMap<String, String> queryParamMap = uriInfo.getQueryParameters();
        Map<String, String> searchValueMap = new HashMap<>();

        if (queryParamMap.size() > 0) {
            for (String queryParam: queryParamMap.keySet()) {
                if (searchableFieldMap.contains(queryParam)) {
                    searchValueMap.put(convertFieldName(queryParam), queryParamMap.get(queryParam).get(0));
                }
            }

            itemChangesList = itemDao.searchItemChanges(searchValueMap);
        }

        return itemChangesList;
    }

    @Override
    public String putItemDescription(String description, int itemId) {
        return itemDao.updateItemDescription(description, itemId);
    }

    // Convert camelCase to snake_case.
    private String convertFieldName(String field) {
        return CaseFormat.LOWER_CAMEL.to(CaseFormat.LOWER_UNDERSCORE, field);
    }

    /**
     * Looks through every property on a change and compares them to see if they've changed between the two values.
     * @param itemChangesOne The first change we're comparing.
     * @param itemChangesTwo The second change we're comparing.
     * @param itemName The name of the item we're comparing.
     * @return A list of the differences for each property of an item.
     */
    private List<Comparison> findDifferences(ItemChanges itemChangesOne, ItemChanges itemChangesTwo, String itemName) {
        List<Comparison> comparisonList = new ArrayList<>();

        try {
            // Use reflection to look at all the properties of ItemChanges.class and compare them.
            for (PropertyDescriptor pd: Introspector.getBeanInfo(ItemChanges.class).getPropertyDescriptors()) {
                if (pd.getReadMethod() != null && !"class".equals(pd.getName())) {
                    // We compare the same fields that are searchable, so make sure the property we're looking at
                    // is in that list.
                    if (searchableFieldMap.contains(pd.getName())) {
                        String valueOne = "";
                        String valueTwo = "";
                        String updated = "";

                        if (itemChangesOne != null && pd.getReadMethod().invoke(itemChangesOne) != null) {
                            valueOne = pd.getReadMethod().invoke(itemChangesOne).toString();
                            updated = itemChangesOne.getUpdated();
                        }

                        if (itemChangesTwo != null && pd.getReadMethod().invoke(itemChangesTwo) != null) {
                            valueTwo = pd.getReadMethod().invoke(itemChangesTwo).toString();
                        }

                        Comparison comparison = createComparison(pd.getName(), valueOne, valueTwo, itemName, updated);

                        if (comparison != null) {
                            comparisonList.add(comparison);
                        }
                    }
                }
            }
        } catch (IntrospectionException |IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        return comparisonList;
    }

    private Comparison createComparison(String fieldString, String valueOne, String valueTwo, String itemName, String updated) {
        if (!valueOne.equals(valueTwo)) {
            Comparison comparison = new Comparison();

            comparison.setField(fieldString);
            comparison.setItemName(itemName);
            comparison.setNewValue(valueOne);
            comparison.setOldValue(valueTwo);
            comparison.setUpdated(updated);

            return comparison;
        }

        return null;
    }
}

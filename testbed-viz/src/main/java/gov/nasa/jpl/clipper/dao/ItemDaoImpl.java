package gov.nasa.jpl.clipper.dao;

import gov.nasa.jpl.clipper.auth.dao.AuthDaoQueries;
import gov.nasa.jpl.clipper.model.*;
import gov.nasa.jpl.clipper.util.DatabaseUtil;

import java.io.InputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ItemDaoImpl implements ItemDao {

    @Override
    public ItemChanges getItemChangesById(int id) {
        ItemChanges itemChanges = null;

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.ITEM_CHANGES_BY_ID)) {

            preparedStatement.setInt(1, id);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    itemChanges = setItemChanges(resultSet);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChanges;
    }

    @Override
    public List<ItemChanges> getItemChangesById(int id, boolean useItemId) {
        List<ItemChanges> itemChangesList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection()) {
            PreparedStatement preparedStatement;

            if (useItemId) {
                preparedStatement = connection.prepareStatement(ItemDaoQueries.ITEM_CHANGES_QUERY_BY_ITEM_ID);
            } else {
               preparedStatement = connection.prepareStatement(ItemDaoQueries.ITEM_CHANGES_QUERY_BY_ID) ;
            }

            preparedStatement.setInt(1, id);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    itemChangesList.add(setItemChanges(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChangesList;
    }

    @Override
    public List<ItemChanges> getLatestItemChanges() {
        List<ItemChanges> latestItemChanges = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(ItemDaoQueries.LATEST_ITEM_CHANGES)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    latestItemChanges.add(setItemChanges(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return latestItemChanges;
    }

    @Override
    public InputStream getImage(int itemChangeId) {
        InputStream binaryStream = null;

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(ItemDaoQueries.GET_IMAGE)) {

            statement.setInt(1, itemChangeId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Blob imageBlob = resultSet.getBlob("image");
                    binaryStream = imageBlob.getBinaryStream(1, imageBlob.length());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return binaryStream;
    }

    @Override
    public List<ItemChanges> getItemChangesByDateTime(int testbedId, String dateTime) {
        List<ItemChanges> itemChanges = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(ItemDaoQueries.ITEM_CHANGES_BY_DATE_TIME)) {

            statement.setString(1, dateTime);
            statement.setInt(2, testbedId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    itemChanges.add(setItemChanges(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChanges;
    }

    @Override
    public List<ItemData> getItemMetadata() {
        List<ItemData> itemDataList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.GET_ITEM_METADATA);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            while (resultSet.next()) {
                itemDataList.add(setItemData(resultSet));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemDataList;
    }

    @Override
    public List<ItemData> getItemMetadata(int testbedId) {
        List<ItemData> itemDataList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(ItemDaoQueries.ITEM_METADATA_QUERY)) {

            statement.setInt(1, testbedId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    itemDataList.add(setItemData(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemDataList;
    }

    @Override
    public ItemData getItemDataById(int itemId) {
        ItemData itemData = new ItemData();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(ItemDaoQueries.ITEM_METADATA_BY_ID_QUERY)) {

            statement.setInt(1, itemId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    itemData = setItemData(resultSet);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemData;
    }

    @Override
    public void toggleOnline(ItemData itemData) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.TOGGLE_ONLINE_QUERY)) {

            preparedStatement.setInt(1, itemData.getOnline() ? 1 : 0);
            preparedStatement.setInt(2, itemData.getId());

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<ItemChanges> getHistory(int testbedId) {
        List<ItemChanges> itemChangesList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(ItemDaoQueries.HISTORY)) {

            statement.setInt(1, testbedId);

            try(ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    itemChangesList.add(this.setItemChanges(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChangesList;
    }

    public static String prepQueryStringForListSize(String query, int size) {
        StringBuilder queryStr = new StringBuilder(query);
        for (int i = 0; i < size; i++) {
            queryStr.append("?,");
        }
        if (size > 0) queryStr.deleteCharAt(queryStr.length()-1);
        queryStr.append(")");
        return queryStr.toString();

    }
    @Override
    public List<ItemChanges> searchItemChangesForTestbeds(String search, List<Integer> testbedIds) {
        List<ItemChanges> itemChangesList = new ArrayList<>();
        String searchString = "%" + search + "%";
        String queryStr = prepQueryStringForListSize(ItemDaoQueries.ITEM_CHANGES_QUERY_FOR_TESTBED_ID, testbedIds.size());

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(queryStr)) {

            for (int i = 1; i < 9; i++) {
                statement.setString(i, searchString);

            }
            for (int i = 0; i < testbedIds.size(); i++) {
                statement.setInt(i + 9, testbedIds.get(i));
            }

            try(ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    itemChangesList.add(this.setItemChanges(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChangesList;
    }

    @Override
    public int postItemChange(int itemId, ItemChanges itemChanges) {
        int id = -1;

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.CREATE_ITEM_CHANGES, Statement.RETURN_GENERATED_KEYS)) {

            preparedStatement.setInt(1, itemId);
            preparedStatement.setString(2, itemChanges.getStatus());
            preparedStatement.setString(3, itemChanges.getDescription());
            preparedStatement.setString(4, itemChanges.getVersion());
            preparedStatement.setString(5, itemChanges.getSerialNumber());
            preparedStatement.setString(6, itemChanges.getPartNumber());
            preparedStatement.setString(7, itemChanges.getUsername());
            preparedStatement.setString(8, itemChanges.getRationale());
            // Default every item change to online.
            preparedStatement.setString(9, "1");
            preparedStatement.setInt(10, itemChanges.getImage() ? 1 : 0);

            preparedStatement.executeUpdate();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            if (!resultSet.next()) {
                throw new Exception("Insert unsuccessful");
            }

            id = resultSet.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return id;
    }

    @Override
    public void postItemChanges(List<ItemChanges> itemChangesList) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.CREATE_BATCH_ITEM_CHANGES)) {
            int itemChangesCounter = 0;

            for (ItemChanges itemChanges: itemChangesList) {
                preparedStatement.setInt(1, itemChanges.getItemId());
                preparedStatement.setString(2, itemChanges.getUsername());
                preparedStatement.setString(3, itemChanges.getRationale());

                itemChangesCounter++;

                preparedStatement.addBatch();
            }

            if (itemChangesCounter % ItemDaoQueries.BATCH_SIZE == 0 || itemChangesCounter == itemChangesList.size()) {
                preparedStatement.executeBatch();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<ItemStatus> getItemStatus(Integer testbedId) {
        List<ItemStatus> itemStatusList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection()) {
            PreparedStatement preparedStatement;

            if (testbedId != null) {
                preparedStatement = connection.prepareStatement(ItemDaoQueries.ITEM_STATUS_QUERY);

                preparedStatement.setInt(1, testbedId);
            } else {
                preparedStatement = connection.prepareStatement(ItemDaoQueries.ALL_ITEM_STATUS_QUERY);
            }

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    ItemStatus itemStatus = new ItemStatus();
                    String sortOrder;

                    itemStatus.setId(Integer.valueOf(resultSet.getString("id")));
                    itemStatus.setTestbedId(Integer.valueOf(resultSet.getString("testbed_id")));
                    itemStatus.setStatus(resultSet.getString("status"));
                    itemStatus.setColor(resultSet.getString("color"));
                    sortOrder = resultSet.getString("sort_order");

                    if (sortOrder != null) {
                        itemStatus.setSortOrder(Integer.parseInt(sortOrder));
                    }

                    itemStatusList.add(itemStatus);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemStatusList;
    }

    @Override
    public void postItems(int testbedId, List<ItemStructure> itemStructures) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection()) {
            for (ItemStructure itemStructure: itemStructures) {
                insertItemData(itemStructure, connection, testbedId, null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<ItemChanges> searchItemChanges(Map<String, String> searchValueMap) {
        List<ItemChanges> itemChangesList = new ArrayList<>();
        StringBuilder query = new StringBuilder(ItemDaoQueries.SEARCH_ITEM_CHANGES);
        int counter = 0;

        try (Connection connection = DatabaseUtil.getDataSource().getConnection()) {
            // Add an AND for each query param the user sends.
            for (String searchValue: searchValueMap.keySet()) {
                if (counter != 0) {
                    query.append(" AND ");
                }

                // Special case for name, because we have to look in the item_metadata table.
                if (searchValue.equals("name")) {
                    query.append(" item_id in (select id from item_metadata where name like ?) ");
                } else {
                    query.append(searchValue).append(" like ? ");
                }

                counter++;
            }

            PreparedStatement preparedStatement = connection.prepareStatement(query.toString());

            // Set the counter to 1 before we try and set our variables.
            counter = 1;

            // Loop again to set each value.
            for (String searchValue: searchValueMap.keySet()) {
                preparedStatement.setString(counter, "%" + searchValueMap.get(searchValue) + "%");

                counter++;
            }

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                while (resultSet.next()) {
                    itemChangesList.add(setItemChanges(resultSet));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChangesList;
    }

    @Override
    public void saveImage(int itemChangeId, InputStream inputStream) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.SAVE_IMAGE)) {

            preparedStatement.setInt(1, itemChangeId);
            preparedStatement.setBlob(2, inputStream);

            preparedStatement.executeUpdate();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    @Override
    public String updateItemDescription(String description, int itemId) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.UPDATE_ITEM_DESCRIPTION)) {

            preparedStatement.setString(1, description);
            preparedStatement.setInt(2, itemId);

            preparedStatement.executeUpdate();

            return description;
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return null;
    }

    private void insertItemData(ItemStructure item, Connection connection, int testbedId, Integer parentId) {
        try {
            int id = saveItemData(item, connection, testbedId, parentId);

            if (item.getChildren() != null) {
                for (ItemStructure child: item.getChildren()) {
                    // recurse
                    insertItemData(child, connection, testbedId, id);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Integer saveItemData(ItemStructure item, Connection connection, int testbedId, Integer parentId) {
        Integer itemId = null;

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(ItemDaoQueries.CREATE_ITEM_STRUCTURE, Statement.RETURN_GENERATED_KEYS);

            preparedStatement.setInt(1, testbedId);

            if (parentId != null) {
                preparedStatement.setInt(2, parentId);
            } else {
                preparedStatement.setNull(2, Types.INTEGER);
            }

            preparedStatement.setString(3, item.getName());
            preparedStatement.setString(4, item.getFullname());

            preparedStatement.executeUpdate();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            if (!resultSet.next()) {
                throw new Exception("Insert unsuccessful");
            }

            itemId = resultSet.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemId;
    }

    private ItemChanges setItemChanges(ResultSet resultSet) {
        ItemChanges itemChanges = new ItemChanges();

        try {
            itemChanges.setId(Integer.valueOf(resultSet.getString("id")));
            itemChanges.setItemId(Integer.valueOf(resultSet.getString("item_id")));
            itemChanges.setStatus(resultSet.getString("status"));
            itemChanges.setDescription(resultSet.getString("description"));
            itemChanges.setOnline(resultSet.getBoolean("online"));
            itemChanges.setVersion(resultSet.getString("version"));
            itemChanges.setSerialNumber(resultSet.getString("serial_number"));
            itemChanges.setPartNumber(resultSet.getString("part_number"));
            itemChanges.setUsername(resultSet.getString("username"));
            itemChanges.setUpdated(DatabaseUtil.convertMysqlDate(resultSet.getString("updated")));
            itemChanges.setRationale(resultSet.getString("rationale"));
            itemChanges.setImage(Integer.parseInt(resultSet.getString("image")) == 1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChanges;
    }

    private ItemData setItemData(ResultSet resultSet) {
        ItemData itemData = new ItemData();

        try {
            itemData.setId(Integer.valueOf(resultSet.getString("id")));
            itemData.setTestbedId(Integer.parseInt(resultSet.getString("testbed_id")));
            itemData.setName(resultSet.getString("name"));
            itemData.setFullname(resultSet.getString("fullname"));
            itemData.setOnline(resultSet.getString("online").equals("1"));
            itemData.setLocked(resultSet.getString("locked").equals("1"));
            itemData.setName(resultSet.getString("name"));
            itemData.setFullname(resultSet.getString("fullname"));
            itemData.setDescription(resultSet.getString("description"));

            String parentId = resultSet.getString(("parent_id"));

            if (parentId != null) {
                itemData.setParentId(Integer.valueOf(parentId));
            }

            String sortOrder = resultSet.getString("sort_order");

            if (sortOrder != null) {
                itemData.setSortOrder(Integer.valueOf(sortOrder));
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return itemData;
    }
}

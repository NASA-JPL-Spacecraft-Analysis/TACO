package gov.nasa.jpl.clipper.auth.dao;

import gov.nasa.jpl.clipper.model.*;
import gov.nasa.jpl.clipper.util.DatabaseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AuthDaoImpl implements AuthDao {
    @Override
    public ItemData createItemData(ItemData itemData, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.CREATE_ITEM_DATA, Statement.RETURN_GENERATED_KEYS)) {
            setItemDataPreparedStatement(preparedStatement, itemData);

            itemData.setOnline(true);

            preparedStatement.setInt(5, itemData.getTestbedId());
            preparedStatement.setBoolean(6, itemData.getOnline());

            preparedStatement.executeUpdate();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            if (resultSet.next()) {
                itemData.setId(resultSet.getInt(1));

                createItemDataHistory(itemData, username);

                return itemData;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public ItemStatus createItemStatus(ItemStatus itemStatus, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.CREATE_ITEM_STATUS, Statement.RETURN_GENERATED_KEYS)) {
            setItemStatusPreparedStatement(preparedStatement, itemStatus);

            preparedStatement.setInt(4, itemStatus.getTestbedId());

            preparedStatement.executeUpdate();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            if (resultSet.next()) {
                itemStatus.setId(resultSet.getInt(1));

                createItemStatusHistory(itemStatus, username);

                return itemStatus;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public boolean deleteItemChanges(ItemChanges itemChanges, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.DELETE_ITEM_CHANGES)) {
            preparedStatement.setInt(1, itemChanges.getId());

            preparedStatement.executeUpdate();

            createItemChangesHistory(itemChanges, username);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public List<ItemChangesHistory> getItemChangesHistory() {
        List<ItemChangesHistory> itemChangesHistoryList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(AuthDaoQueries.GET_ITEM_CHANGES_HISTORY)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    ItemMetadataHistory itemMetadataHistory = new ItemMetadataHistory();
                    ItemChangesHistory itemChangesHistory = new ItemChangesHistory();

                    itemChangesHistory.setId(Integer.valueOf(resultSet.getString("id")));
                    itemChangesHistory.setItemId(Integer.valueOf(resultSet.getString("item_id")));
                    itemChangesHistory.setStatus(resultSet.getString("status"));
                    itemChangesHistory.setDescription(resultSet.getString("description"));
                    itemChangesHistory.setOnline(resultSet.getBoolean("online"));
                    itemChangesHistory.setVersion(resultSet.getString("version"));
                    itemChangesHistory.setSerialNumber(resultSet.getString("serial_number"));
                    itemChangesHistory.setPartNumber(resultSet.getString("part_number"));
                    itemChangesHistory.setUsername(resultSet.getString("username"));
                    itemChangesHistory.setUpdated(DatabaseUtil.convertMysqlDate(resultSet.getString("updated")));
                    itemChangesHistory.setRationale(resultSet.getString("rationale"));
                    itemChangesHistory.setImage(Integer.parseInt(resultSet.getString("image")) == 1);
                    itemChangesHistory.setModifiedAt(DatabaseUtil.convertMysqlDate(resultSet.getString("modified_at")));
                    itemChangesHistory.setModifiedBy(resultSet.getString("modified_by"));

                    itemChangesHistoryList.add(itemChangesHistory);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemChangesHistoryList;
    }

    @Override
    public List<ItemMetadataHistory> getItemMetadataHistory() {
        List<ItemMetadataHistory> itemMetadataHistoryList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(AuthDaoQueries.GET_ITEM_METADATA_HISTORY)) {

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    ItemMetadataHistory itemMetadataHistory = new ItemMetadataHistory();

                    itemMetadataHistory.setId(Integer.valueOf(resultSet.getString("id")));
                    itemMetadataHistory.setTestbedId(Integer.parseInt(resultSet.getString("testbed_id")));
                    itemMetadataHistory.setName(resultSet.getString("name"));
                    itemMetadataHistory.setFullname(resultSet.getString("fullname"));
                    itemMetadataHistory.setOnline(resultSet.getString("online").equals("1"));
                    itemMetadataHistory.setLocked(resultSet.getString("locked").equals("1"));
                    itemMetadataHistory.setName(resultSet.getString("name"));
                    itemMetadataHistory.setFullname(resultSet.getString("fullname"));
                    itemMetadataHistory.setItemDataId(Integer.parseInt(resultSet.getString("item_metadata_id")));
                    itemMetadataHistory.setUsername(resultSet.getString("username"));

                    itemMetadataHistoryList.add(itemMetadataHistory);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemMetadataHistoryList;
    }

    @Override
    public boolean updateDeleted(ItemData itemData, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_DELETED)) {
            preparedStatement.setBoolean(1, itemData.getDeleted());
            preparedStatement.setInt(2, itemData.getId());

            preparedStatement.executeUpdate();

            createItemDataHistory(itemData, username);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemData.getLocked();
    }

    @Override
    public ItemChanges updateItemChanges(ItemChanges itemChanges, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_ITEM_CHANGES)) {
            setItemChangesPreparedStatement(preparedStatement, itemChanges);

            preparedStatement.setInt(12, itemChanges.getId());

            preparedStatement.executeUpdate();

            createItemChangesHistory(itemChanges, username);

            return itemChanges;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public ItemData updateItemData(ItemData itemData, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_ITEM_DATA)) {
            setItemDataPreparedStatement(preparedStatement, itemData);

            preparedStatement.setInt(5, itemData.getId());

            preparedStatement.executeUpdate();

            createItemDataHistory(itemData, username);

            return itemData;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public ItemStatus updateItemStatus(ItemStatus itemStatus, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_ITEM_STATUS)) {

            setItemStatusPreparedStatement(preparedStatement, itemStatus);

            preparedStatement.setInt(4, itemStatus.getId());

            preparedStatement.executeUpdate();

            createItemStatusHistory(itemStatus, username);

            return itemStatus;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public boolean updateLocked(ItemData itemData, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_LOCKED)) {
            preparedStatement.setBoolean(1, itemData.getLocked());
            preparedStatement.setInt(2, itemData.getId());

            preparedStatement.executeUpdate();

            createItemDataHistory(itemData, username);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return itemData.getLocked();
    }

    @Override
    public Integer updateSortOrder(Integer sortOrder, int testbedId) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_SORT_ORDER)) {
            if (sortOrder != null) {
                preparedStatement.setInt(1, sortOrder);
            } else {
                preparedStatement.setNull(1, Types.INTEGER);
            }

            preparedStatement.setInt(2, testbedId);

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (sortOrder != null) {
            return Integer.valueOf(sortOrder);
        }

        return null;
    }

    @Override
    public TestbedSettings updateTestbedSettings(TestbedSettings testbedSettings, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.UPDATE_TESTBED_SETTINGS)) {
            setTestbedSettingsPreparedStatement(preparedStatement, testbedSettings);

            preparedStatement.setInt(7, testbedSettings.getId());

            preparedStatement.executeUpdate();

            createTestbedSettingsHistory(testbedSettings, username);

            return testbedSettings;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private void createItemChangesHistory(ItemChanges itemChanges, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.CREATE_ITEM_CHANGES_HISTORY)) {
            setItemChangesPreparedStatement(preparedStatement, itemChanges);
            preparedStatement.setInt(12, itemChanges.getId());
            preparedStatement.setString(13, username);

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createItemDataHistory(ItemData itemData, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.CREATE_ITEM_DATA_HISTORY)) {
            setItemDataPreparedStatement(preparedStatement, itemData);
            preparedStatement.setInt(5, itemData.getTestbedId());
            preparedStatement.setBoolean(6, itemData.getDeleted());
            preparedStatement.setBoolean(7, itemData.getOnline());
            preparedStatement.setBoolean(8, itemData.getLocked());
            preparedStatement.setInt(9, itemData.getId());
            preparedStatement.setString(10, username);

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createItemStatusHistory(ItemStatus itemStatus, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.CREATE_ITEM_STATUS_HISTORY)) {
            preparedStatement.setInt(1, itemStatus.getId());
            preparedStatement.setInt(2, itemStatus.getTestbedId());
            preparedStatement.setString(3, itemStatus.getStatus());
            preparedStatement.setString(4, itemStatus.getColor());

            if (itemStatus.getSortOrder() == null) {
                preparedStatement.setNull(5, Types.INTEGER);
            } else {
                preparedStatement.setInt(5, itemStatus.getSortOrder());
            }

            preparedStatement.setString(6, username);

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void createTestbedSettingsHistory(TestbedSettings testbedSettings, String username) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AuthDaoQueries.CREATE_TESTBED_SETTINGS_HISTORY)) {
            setTestbedSettingsPreparedStatement(preparedStatement, testbedSettings);

            preparedStatement.setInt(7, testbedSettings.getId());
            preparedStatement.setString(8, username);

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void setItemChangesPreparedStatement(PreparedStatement preparedStatement, ItemChanges itemChanges) {
        try {
            preparedStatement.setString(1, itemChanges.getDescription());
            preparedStatement.setInt(2, itemChanges.getItemId());
            preparedStatement.setBoolean(3, itemChanges.getImage());
            preparedStatement.setBoolean(4, itemChanges.getOnline());
            preparedStatement.setString(5, itemChanges.getPartNumber());
            preparedStatement.setString(6, itemChanges.getRationale());
            preparedStatement.setString(7, itemChanges.getSerialNumber());
            preparedStatement.setString(8, itemChanges.getStatus());
            preparedStatement.setString(9, itemChanges.getVersion());
            preparedStatement.setString(10, DatabaseUtil.convertIsoDate(itemChanges.getUpdated()));
            preparedStatement.setString(11, itemChanges.getUsername());
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    private void setItemDataPreparedStatement(PreparedStatement preparedStatement, ItemData itemData) {
        try {
            preparedStatement.setString(1, itemData.getName());
            preparedStatement.setString(2, itemData.getFullname());

            if (itemData.getSortOrder() == null) {
                preparedStatement.setNull(3, Types.INTEGER);
            } else {
                preparedStatement.setInt(3, itemData.getSortOrder());
            }

            if (itemData.getParentId() == null) {
                preparedStatement.setNull(4, Types.INTEGER);
            } else {
                preparedStatement.setInt(4, itemData.getParentId());
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    private void setItemStatusPreparedStatement(PreparedStatement preparedStatement, ItemStatus itemStatus) {
        try {
            preparedStatement.setString(1, itemStatus.getStatus());
            preparedStatement.setString(2, itemStatus.getColor());

            if (itemStatus.getSortOrder() == null) {
                preparedStatement.setNull(3, Types.INTEGER);
            } else {
                preparedStatement.setInt(3, itemStatus.getSortOrder());
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    private void setTestbedSettingsPreparedStatement(PreparedStatement preparedStatement, TestbedSettings testbedSettings) {
        try {
            preparedStatement.setString(1, testbedSettings.getEmailNotificationsList());
            preparedStatement.setInt(2, testbedSettings.getRecentlyChangedIndicatorEnabled() ? 1 : 0);

            if (testbedSettings.getRecentlyChangedIndicatorDays() == null) {
                preparedStatement.setNull(3, Types.NULL);
            } else {
                preparedStatement.setInt(3, testbedSettings.getRecentlyChangedIndicatorDays());
            }

            preparedStatement.setString(4, testbedSettings.getTestbedEditGroup());

            preparedStatement.setInt(5, testbedSettings.getAutoRefreshEnabled() ? 1 : 0);

            if (testbedSettings.getAutoRefreshInterval() == null) {
                preparedStatement.setNull(6, Types.NULL);
            } else {
                preparedStatement.setInt(6, testbedSettings.getAutoRefreshInterval());
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }
}


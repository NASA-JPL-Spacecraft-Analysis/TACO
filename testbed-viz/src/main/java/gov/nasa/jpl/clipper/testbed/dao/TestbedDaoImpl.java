package gov.nasa.jpl.clipper.testbed.dao;

import gov.nasa.jpl.clipper.model.ItemStatus;
import gov.nasa.jpl.clipper.model.Testbed;
import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.model.TestbedStructure;
import gov.nasa.jpl.clipper.util.DatabaseUtil;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class TestbedDaoImpl implements TestbedDao {
    @Override
    public void postStatuses(int testbedId, List<ItemStatus> statuses) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.createStatuses);
            int counter = 0;

            for (ItemStatus status: statuses) {
                preparedStatement.setInt(1, testbedId);
                preparedStatement.setString(2, status.getStatus());
                preparedStatement.setString(3, status.getColor());

                preparedStatement.addBatch();
                counter++;

                if (counter % 1000 == 0 || counter == statuses.size()) {
                    preparedStatement.executeBatch();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Testbed postTestbed(TestbedStructure testbedStructure) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.createTestbed, Statement.RETURN_GENERATED_KEYS)) {

            preparedStatement.setString(1, testbedStructure.getName());
            preparedStatement.setString(2, testbedStructure.getAcronym());

            preparedStatement.executeUpdate();

            ResultSet resultSet = preparedStatement.getGeneratedKeys();

            if (!resultSet.next()) {
                throw new Exception("Insert of testbed " + testbedStructure.getName() + " unsuccessful.");
            }

            return getTestbedById(resultSet.getInt(1));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    @Override
    public void postTestbedSettings(int testbedId) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.createTestbedSettings)) {

            preparedStatement.setInt(1, testbedId);

            preparedStatement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public List<Testbed> getTestbeds() {
        List<Testbed> testbedList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.getTestbeds);
             ResultSet resultSet = preparedStatement.executeQuery()) {

            while (resultSet.next()) {
                testbedList.add(setTestbed(resultSet));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return testbedList;
    }

    @Override
    public Testbed getTestbedById(int testbedId) {
        Testbed testbed = new Testbed();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.getTestbedById)) {

            preparedStatement.setInt(1, testbedId);

            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                testbed = setTestbed(resultSet);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return testbed;
    }

    @Override
    public List<TestbedSettings> getTestbedSettings() {
        List<TestbedSettings> testbedSettingsList = new ArrayList<>();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.getTestbedSettings)) {
            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                TestbedSettings testbedSettings = new TestbedSettings();
                String recentlyChangedIndicatorEnabled;
                String recentlyChangedIndicatorDays;
                String autoRefreshEnabled;
                String autoRefreshInterval;

                testbedSettings.setId(Integer.parseInt(resultSet.getString("id")));
                testbedSettings.setTestbedId(Integer.parseInt(resultSet.getString("testbed_id")));
                testbedSettings.setEmailNotificationsList(resultSet.getString("email_notifications_list"));
                testbedSettings.setTestbedEditGroup(resultSet.getString("testbed_edit_group"));

                recentlyChangedIndicatorEnabled = resultSet.getString("recently_changed_indicator_enabled");
                recentlyChangedIndicatorDays = resultSet.getString("recently_changed_indicator_days");
                autoRefreshEnabled = resultSet.getString("auto_refresh_enabled");
                autoRefreshInterval = resultSet.getString("auto_refresh_interval");

                if (recentlyChangedIndicatorEnabled != null) {
                    testbedSettings.setRecentlyChangedIndicatorEnabled(Integer.parseInt(recentlyChangedIndicatorEnabled) == 1);
                }

                if (recentlyChangedIndicatorDays != null) {
                    testbedSettings.setRecentlyChangedIndicatorDays(Integer.parseInt(recentlyChangedIndicatorDays));
                } else {
                    testbedSettings.setRecentlyChangedIndicatorDays(null);
                }

                if (autoRefreshEnabled != null) {
                    testbedSettings.setAutoRefreshEnabled(Integer.parseInt(autoRefreshEnabled) == 1);
                }

                if (autoRefreshInterval != null) {
                    testbedSettings.setAutoRefreshInterval(Integer.parseInt(autoRefreshInterval));
                } else {
                    testbedSettings.setAutoRefreshInterval(null);
                }

                testbedSettingsList.add(testbedSettings);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return testbedSettingsList;
    }

    @Override
    public TestbedSettings getTestbedSettingsById(int testbedId) {
        TestbedSettings testbedSettings = new TestbedSettings();

        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.getTestbedSettingsById)) {

            preparedStatement.setInt(1, testbedId);

            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {
                testbedSettings.setId(Integer.parseInt(resultSet.getString("id")));
                testbedSettings.setTestbedId(Integer.parseInt(resultSet.getString("testbed_id")));
                testbedSettings.setEmailNotificationsList(resultSet.getString("email_notifications_list"));
                testbedSettings.setTestbedEditGroup(resultSet.getString("testbed_edit_group"));
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return testbedSettings;
    }

    @Override
    public String updateTestbedDescription(String description, int testbedId) {
        try (Connection connection = DatabaseUtil.getDataSource().getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(TestbedDaoQueries.UPDATE_TESTBED_DESCRIPTION)) {

            preparedStatement.setString(1, description);
            preparedStatement.setInt(2, testbedId);

            preparedStatement.executeUpdate();

            return description;
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return null;
    }

    private Testbed setTestbed(ResultSet resultSet) {
        Testbed testbed = new Testbed();

        try {
            testbed.setAcronym(resultSet.getString("acronym"));
            testbed.setDescription(resultSet.getString("description"));
            testbed.setId(Integer.valueOf(resultSet.getString("id")));
            testbed.setName(resultSet.getString("name"));

            String sortOrder = resultSet.getString("sort_order");

            if (sortOrder != null) {
                testbed.setSortOrder(Integer.valueOf(resultSet.getString("sort_order")));
            } else {
                testbed.setSortOrder(null);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return testbed;
    }
}

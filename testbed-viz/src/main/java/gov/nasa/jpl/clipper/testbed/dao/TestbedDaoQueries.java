package gov.nasa.jpl.clipper.testbed.dao;

public class TestbedDaoQueries {
    public static String createStatuses = " insert into item_status "
                                        + " (testbed_id, status, color) "
                                        + " values "
                                        + " (?, ?, ?) ";

    public static String createTestbed = " insert into testbeds "
                                       + " (name, acronym) "
                                       + " values "
                                       + " (?, ?) ";

    public static String getTestbeds = " select * from testbeds where enabled = '1' ";

    public static String getTestbedById = " select * from testbeds "
                                        + " where id = ? ";

    public static String getTestbedSettings = " select * from testbed_settings ";

    public static String getTestbedSettingsById = " select * from testbed_settings "
                                                + " where testbed_id = ? ";

    public static String createTestbedSettings = " insert into testbed_settings "
                                               + " (testbed_id) "
                                               + " values "
                                               + " (?) ";

    public static String UPDATE_TESTBED_DESCRIPTION = " update testbeds "
                                                    + " set description = ? "
                                                    + " where id = ? ";
}

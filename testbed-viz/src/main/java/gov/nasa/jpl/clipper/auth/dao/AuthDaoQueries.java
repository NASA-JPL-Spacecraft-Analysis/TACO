package gov.nasa.jpl.clipper.auth.dao;

public class AuthDaoQueries {
    public static String CREATE_ITEM_DATA  = " insert into item_metadata "
                                           + " (name, fullname, sort_order, parent_id, testbed_id, online) "
                                           + " values "
                                           + " (?, ?, ?, ?, ?, ?) ";

    public static String CREATE_ITEM_STATUS = " insert into item_status"
                                            + " (status, color, sort_order, testbed_id) "
                                            + " values "
                                            + " (?, ?, ?, ?) ";

    public static String CREATE_ITEM_CHANGES_HISTORY = " insert into item_changes_history "
                                                     + " (description, item_id, image, online, part_number, rationale, serial_number, status, version, updated, username, item_changes_id, modified_by) "
                                                     + " values "
                                                     + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

    public static String CREATE_ITEM_DATA_HISTORY = " insert into item_metadata_history "
                                                  + " (name, fullname, sort_order, parent_id, testbed_id, deleted, online, locked, item_metadata_id, username) "
                                                  + " values "
                                                  + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

    public static String CREATE_ITEM_STATUS_HISTORY = " insert into item_status_history "
                                                    + " (item_status_id, testbed_id, status, color, sort_order, username) "
                                                    + " values "
                                                    + " (?, ?, ?, ?, ?, ?) ";

    public static String CREATE_TESTBED_SETTINGS_HISTORY = " insert into testbed_settings_history "
                                                         + " set email_notifications_list = ?, "
                                                         + " recently_changed_indicator_enabled = ?, "
                                                         + " recently_changed_indicator_days = ?, "
                                                         + " testbed_edit_group = ?, "
                                                         + " auto_refresh_enabled = ?, "
                                                         + " auto_refresh_interval = ?, "
                                                         + " testbed_settings_id = ?, "
                                                         + " username = ? ";

    public static String DELETE_ITEM_CHANGES = " update item_changes "
                                             + " set online = 0 "
                                             + " where id = ? ";

    public static String GET_ITEM_CHANGES_HISTORY = " select * from item_changes_history ";

    public static String GET_ITEM_METADATA_HISTORY = " select * from item_metadata_history ";

    public static String UPDATE_DELETED = " update item_metadata "
                                        + " set deleted = ? "
                                        + " where id = ? ";

    public static String UPDATE_ITEM_CHANGES = " update item_changes "
                                             + " set description = ?, "
                                             + " item_id = ?, "
                                             + " image = ?, "
                                             + " online = ?, "
                                             + " part_number = ?, "
                                             + " rationale = ?, "
                                             + " serial_number = ?, "
                                             + " status = ?, "
                                             + " version = ?, "
                                             + " updated = ?, "
                                             + " username = ? "
                                             + " where id = ? ";

    public static String UPDATE_ITEM_DATA = " update item_metadata "
                                          + " set name = ?, fullname = ?, sort_order = ?, parent_id = ? "
                                          + " where id = ? ";

    public static String UPDATE_ITEM_STATUS = " update item_status "
                                            + " set status = ?, color = ?, sort_order = ? "
                                            + " where id = ? ";

    public static String UPDATE_LOCKED = " update item_metadata "
                                       + " set locked = ? "
                                       + " where id = ? ";

    public static String UPDATE_SORT_ORDER = " update testbeds "
                                           + " set sort_order = ? "
                                           + " where id = ? ";

    public static String UPDATE_TESTBED_SETTINGS = " update testbed_settings "
                                                 + " set email_notifications_list = ?, "
                                                 + " recently_changed_indicator_enabled = ?, "
                                                 + " recently_changed_indicator_days = ?, "
                                                 + " testbed_edit_group = ?, "
                                                 + " auto_refresh_enabled = ?, "
                                                 + " auto_refresh_interval = ? "
                                                 + " where id = ? ";
}

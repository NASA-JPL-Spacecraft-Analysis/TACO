package gov.nasa.jpl.clipper.dao;

public class ItemDaoQueries {
    public static int BATCH_SIZE = 1000;

    public static String GET_IMAGE = " select * from images "
                                   + " where item_change_id = ? ";

    public static String GET_ITEM_METADATA = " select * from item_metadata "
                                           + " where deleted  = 0 "
                                           + " order by sort_order asc, id asc ";

    public static String ITEM_METADATA_QUERY = " select * from item_metadata "
                                             + " where testbed_id = ? "
                                             + " and deleted = 0 "
                                             + " order by sort_order asc,"
                                             + " id asc ";

    public static String ITEM_METADATA_BY_ID_QUERY = " select * from item_metadata "
                                                   + " where id = ? "
                                                   + " and deleted = 0 ";

    public static String ITEM_CHANGES_BY_ID = " select * from item_changes "
                                            + " where id = ? ";

    public static String ITEM_CHANGES_QUERY_BY_ITEM_ID = " select * from item_changes "
                                                       + " where item_id = ? "
                                                       + " and online = 1 "
                                                       + " order by updated desc ";

    public static String ITEM_CHANGES_QUERY_BY_ID = " select * from item_changes "
                                                  + " where item_id in (select item_id from item_changes where id = ?) "
                                                  + " and online = 1 "
                                                  + " order by updated desc ";

    public static String ITEM_CHANGES_QUERY_FOR_TESTBED_ID = " select * from item_changes "
                                                            + " inner join item_metadata "
                                                            + " on item_changes.item_id = item_metadata.id "
                                                            + " where (item_metadata.fullname like ? "
                                                            + " or item_metadata.name like ? "
                                                            + " or item_changes.description like ? "
                                                            + " or item_changes.version like ? "
                                                            + " or item_changes.serial_number like ? "
                                                            + " or item_changes.part_number like ? "
                                                            + " or item_changes.username like ? "
                                                            + " or item_changes.rationale like ?) "
                                                            + " and item_metadata.testbed_id in (";




    public static String TOGGLE_ONLINE_QUERY = " update item_metadata "
                                              + " set online = ? "
                                              + " where id = ? ";

    public static String HISTORY = " select * from item_changes "
                                 + " where item_id in (select id from item_metadata where testbed_id = ? and deleted = 0) "
                                 + " and online = 1 "
                                 + " order by updated desc ";

    public static String LATEST_ITEM_CHANGES = " select i.* from item_changes i "
                                             + " join (select max(updated) maxUpdated, id, item_id from item_changes group by item_id) m "
                                             + " on i.updated = m.maxUpdated and i.item_id = m.item_id ";

    public static String ITEM_CHANGES_BY_DATE_TIME = " select * from item_changes "
                                                   + " where id in "
                                                   + " (select id from item_changes where updated < ?) "
                                                   + " and item_id in (select id from item_metadata where testbed_id = ?) "
                                                   + " order by updated desc ";

    public static String CREATE_ITEM_CHANGES = " insert into item_changes "
                                             + " (item_id, status, description, version, serial_number, part_number, username, rationale, online, image) "
                                             + " values "
                                             + " (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";

    public static String CREATE_BATCH_ITEM_CHANGES = " insert into item_changes "
                                                   + " (item_id, username, rationale) "
                                                   + " values "
                                                   + " (?, ?, ?) ";

    public static String ALL_ITEM_STATUS_QUERY = " select * from item_status ";

    public static String ITEM_STATUS_QUERY = " select * from item_status where testbed_id = ? ";

    public static String CREATE_ITEM_STRUCTURE = " insert into item_metadata "
                                            + " (testbed_id, parent_id, name, fullname) "
                                            + " values "
                                            + " (?, ?, ?, ?) ";

    public static String SAVE_IMAGE = " insert into images "
                                    + " (item_change_id, image) "
                                    + " values "
                                    + " (?, ?) ";

    public static String SEARCH_ITEM_CHANGES = " select * from item_changes where ";

    public static String UPDATE_ITEM_DESCRIPTION = " update item_metadata "
                                                 + " set description = ? "
                                                 + " where id = ? ";
}

package gov.nasa.jpl.clipper.model;

public class ItemMetadataHistory extends ItemData {
    private Integer itemDataId;
    private String username;

    public Integer getItemDataId() {
        return itemDataId;
    }

    public void setItemDataId(Integer itemDataId) {
        this.itemDataId = itemDataId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}

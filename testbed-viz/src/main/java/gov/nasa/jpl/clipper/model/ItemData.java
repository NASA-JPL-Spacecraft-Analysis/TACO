package gov.nasa.jpl.clipper.model;

import java.io.Serializable;
import java.util.List;

public class ItemData implements Serializable {
    private List<ItemData> children;
    private boolean deleted;
    private String description;
    private String fullname;
    private Integer id;
    private ItemChanges latestChange;
    private boolean locked;
    private boolean online;
    private Integer parentId;
    private String name;
    private Integer sortOrder;
    private Integer testbedId;

    public List<ItemData> getChildren() {
        return children;
    }

    public void setChildren(List<ItemData> children) {
        this.children = children;
    }

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ItemChanges getLatestChange() {
        return latestChange;
    }

    public void setLatestChange(ItemChanges latestChange) {
        this.latestChange = latestChange;
    }

    public boolean getLocked() {
        return locked;
    }

    public void setLocked(boolean locked) {
        this.locked = locked;
    }

    public boolean getOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getTestbedId() {
        return testbedId;
    }

    public void setTestbedId(Integer testbedId) {
        this.testbedId = testbedId;
    }
}

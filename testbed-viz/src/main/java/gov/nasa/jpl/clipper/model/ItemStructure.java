package gov.nasa.jpl.clipper.model;

import java.io.Serializable;
import java.util.List;

public class ItemStructure implements Serializable {
    private String name;
    private String fullname;
    private boolean online;
    private List<ItemStructure> children;
    // Allow the user to include latestChanges, they'll be ignored when uploaded.
    private ItemChanges latestChange;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public boolean getOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public List<ItemStructure> getChildren() {
        return children;
    }

    public void setChildren(List<ItemStructure> children) {
        this.children = children;
    }

    public ItemChanges getLatestChange() {
        return latestChange;
    }

    public void setLatestChange(ItemChanges latestChange) {
        this.latestChange = latestChange;
    }
}

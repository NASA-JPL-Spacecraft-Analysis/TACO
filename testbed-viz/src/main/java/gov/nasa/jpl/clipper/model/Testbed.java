package gov.nasa.jpl.clipper.model;

import java.util.List;

public class Testbed {
    private String acronym;
    private String description;
    private Integer id;
    private List<ItemData> items;
    private String name;
    private List<ItemStatus> statuses;
    private Integer sortOrder;

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public List<ItemData> getItems() {
        return items;
    }

    public void setItems(List<ItemData> items) {
        this.items = items;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ItemStatus> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<ItemStatus> statuses) {
        this.statuses = statuses;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}

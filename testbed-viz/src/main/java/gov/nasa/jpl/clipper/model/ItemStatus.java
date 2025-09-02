package gov.nasa.jpl.clipper.model;

import java.io.Serializable;

public class ItemStatus implements Serializable {
    private Integer id;
    private Integer testbedId;
    private String status;
    private String color;
    private Integer sortOrder;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTestbedId() {
        return testbedId;
    }

    public void setTestbedId(Integer testbedId) {
        this.testbedId = testbedId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}

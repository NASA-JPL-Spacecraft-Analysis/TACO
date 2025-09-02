package gov.nasa.jpl.clipper.model;

import java.io.Serializable;
import java.util.List;

public class TestbedStructure implements Serializable  {
    private String name;
    private String acronym;
    private List<ItemStructure> items;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public List<ItemStructure> getItems() {
        return items;
    }

    public void setItems(List<ItemStructure> items) {
        this.items = items;
    }
}

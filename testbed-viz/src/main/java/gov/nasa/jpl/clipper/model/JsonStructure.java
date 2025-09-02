package gov.nasa.jpl.clipper.model;

import java.util.List;

public class JsonStructure {
    private List<ItemStatus> statuses;
    private TestbedStructure testbedStructure;

    public List<ItemStatus> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<ItemStatus> statuses) {
        this.statuses = statuses;
    }

    public TestbedStructure getTestbedStructure() {
        return testbedStructure;
    }

    public void setTestbedStructure(TestbedStructure testbedStructure) {
        this.testbedStructure = testbedStructure;
    }
}

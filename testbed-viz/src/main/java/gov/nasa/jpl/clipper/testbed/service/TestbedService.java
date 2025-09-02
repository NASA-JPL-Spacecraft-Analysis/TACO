package gov.nasa.jpl.clipper.testbed.service;

import gov.nasa.jpl.clipper.model.JsonStructure;
import gov.nasa.jpl.clipper.model.Testbed;
import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.service.ItemService;

import java.util.List;

public interface TestbedService {
    void setItemService(ItemService itemService);

    /**
     * Post a new testbed.  After we creat the actual testbed, we do the following:
     * 1. Create an empty testbed settings.
     * 2. Create all the uploaded statuses.
     * 3. Create all the testbed's items.
     * @param jsonStructure The json that the user wants to create.
     * @return The testbed that was just created.
     */
    Testbed postTestbed(JsonStructure jsonStructure);

    List<Testbed> getTestbeds();
    Testbed getTestbedById(int testbedId);
    List<TestbedSettings> getTestbedSettings();
    TestbedSettings getTestbedSettingsById(int testbedId);

    String putTestbedDescription(String description, int testbedId);
}

package gov.nasa.jpl.clipper.testbed.dao;

import gov.nasa.jpl.clipper.model.ItemStatus;
import gov.nasa.jpl.clipper.model.Testbed;
import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.model.TestbedStructure;

import java.util.List;

public interface TestbedDao {
    void postStatuses(int testbedId, List<ItemStatus> statuses);

    Testbed postTestbed(TestbedStructure testbedStructure);

    /**
     * Create testbed settings.
     * @param testbedId The testbed we're creating the settings for.
     */
    void postTestbedSettings(int testbedId);

    /**
     * Gets all the testbeds.
     * @return The list of testbeds.
     */
    List<Testbed> getTestbeds();

    /**
     * Gets a testbed by it's id.
     * @param testbedId The testbed's id.
     * @return The testbed.
     */
    Testbed getTestbedById(int testbedId);

    List<TestbedSettings> getTestbedSettings();

    /**
     * Gets the testbed settings for a given testbed id.
     * @param testbedId The testbed id that we want for the settings for.
     * @return The testbed's settings.
     */
    TestbedSettings getTestbedSettingsById(int testbedId);

    String updateTestbedDescription(String description, int testbedId);
}

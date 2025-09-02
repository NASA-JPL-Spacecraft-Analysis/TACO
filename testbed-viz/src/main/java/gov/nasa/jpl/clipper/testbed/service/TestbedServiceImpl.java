package gov.nasa.jpl.clipper.testbed.service;

import gov.nasa.jpl.clipper.model.ItemStatus;
import gov.nasa.jpl.clipper.model.JsonStructure;
import gov.nasa.jpl.clipper.model.Testbed;
import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.service.ItemService;
import gov.nasa.jpl.clipper.service.ItemServiceImpl;
import gov.nasa.jpl.clipper.testbed.dao.TestbedDao;
import gov.nasa.jpl.clipper.testbed.dao.TestbedDaoImpl;

import java.util.List;
import java.util.Map;

public class TestbedServiceImpl implements TestbedService {
    private ItemService itemService;
    private final TestbedDao testbedDao;

    public TestbedServiceImpl() {
        itemService = new ItemServiceImpl();
        testbedDao = new TestbedDaoImpl();
    }

    @Override
    public void setItemService(ItemService itemService) {
        this.itemService = itemService;
    }

    @Override
    public Testbed postTestbed(JsonStructure jsonStructure) {
        Testbed testbed = testbedDao.postTestbed(jsonStructure.getTestbedStructure());

        testbedDao.postTestbedSettings(testbed.getId());
        testbedDao.postStatuses(testbed.getId(), jsonStructure.getStatuses());
        itemService.postItems(testbed.getId(), jsonStructure.getTestbedStructure().getItems());

        return testbed;
    }

    @Override
    public List<Testbed> getTestbeds() {
        List<Testbed> testbeds = testbedDao.getTestbeds();
        Map<Integer, List<ItemStatus>> testbedIdToItemStatusListMap = itemService.getAllItemStatuses();

        ItemStatus notPresentAbsentStatus = new ItemStatus();

        notPresentAbsentStatus.setId(-1);
        notPresentAbsentStatus.setColor("#a9a9a9");
        notPresentAbsentStatus.setStatus("Not Present/Absent");

        for (Testbed testbed: testbeds) {
            testbed.setStatuses(testbedIdToItemStatusListMap.get(testbed.getId()));

            // Add our default status to each testbed.
            notPresentAbsentStatus.setTestbedId(testbed.getId());
            testbed.getStatuses().add(notPresentAbsentStatus);
        }

        return testbeds;
    }

    @Override
    public Testbed getTestbedById(int testbedId) {
        Testbed testbed = testbedDao.getTestbedById(testbedId);

        // If our id is null, then there wasn't a testbed with the given id.
        if (testbed.getId() != null) {
            testbed.setItems(itemService.getItemData(testbedId, null));
            testbed.setStatuses(itemService.getItemStatus(testbed.getId()));
        } else {
            testbed = null;
        }

        return testbed;
    }

    @Override
    public List<TestbedSettings> getTestbedSettings() {
        return testbedDao.getTestbedSettings();
    }

    @Override
    public TestbedSettings getTestbedSettingsById(int testbedId) {
        TestbedSettings testbedSettings = this.testbedDao.getTestbedSettingsById(testbedId);

        if (testbedSettings == null) {
            this.testbedDao.postTestbedSettings(testbedId);
        }

        return testbedSettings;
    }

    @Override
    public String putTestbedDescription(String description, int testbedId) {
        return testbedDao.updateTestbedDescription(description, testbedId);
    }
}

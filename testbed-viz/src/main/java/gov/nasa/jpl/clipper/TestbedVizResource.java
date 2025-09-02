package gov.nasa.jpl.clipper;

import gov.nasa.jpl.clipper.model.*;
import gov.nasa.jpl.clipper.service.*;
import gov.nasa.jpl.clipper.testbed.service.TestbedService;
import gov.nasa.jpl.clipper.testbed.service.TestbedServiceImpl;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Path("v1/")
public class TestbedVizResource {
    private final ImageService imageService;
    private final ItemService itemService;
    private final MailService mailService;
    private final UserService userService;
    private final TestbedService testbedService;
    private final boolean productionFlag;

    public TestbedVizResource() {
        imageService = new ImageServiceImpl();
        itemService = new ItemServiceImpl();
        mailService = new MailServiceImpl();
        testbedService = new TestbedServiceImpl();
        userService = new UserServiceImpl();

        testbedService.setItemService(itemService);

        productionFlag = Boolean.parseBoolean(System.getenv("PRODUCTION_FLAG"));
    }

    @GET
    @Path("/item-changes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTest(@Context UriInfo uriInfo)  {
        List<ItemChanges> itemChangesList = itemService.searchItemChanges(uriInfo);

        if (itemChangesList.size() > 0) {
            return Response.status(Response.Status.OK).entity(itemChangesList).build();
        }

        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/testbeds")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTestbeds() {
        List<Testbed> testbeds = testbedService.getTestbeds();

        if (testbeds.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(testbeds).build();
    }

    @GET
    @Path("/testbed/{testbedId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTestbedById(@PathParam("testbedId") int testbedId) {
        Testbed testbed = testbedService.getTestbedById(testbedId);

        if (testbed == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(testbed).build();
    }

    @GET
    @Path("/testbed/{testbedId}/comparison/{firstDatetime}/{secondDatetime}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getComparison(
            @PathParam("testbedId") int testbedId,
            @PathParam("firstDatetime") String firstDatetime,
            @PathParam("secondDatetime") String secondDatetime
    ) {
        List<Comparison> comparisonList = itemService.getComparison(testbedId, firstDatetime, secondDatetime);

        if (comparisonList == null || comparisonList.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(comparisonList).build();
    }

    @GET
    @Path("/testbed/{testbedId}/snapshot")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSnapshot(@PathParam("testbedId") int testbedId) {
        List<ItemData> itemDataTree = itemService.getSnapshot(testbedId);

        if (itemDataTree.size() == 0) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemDataTree).build();
    }

    @GET
    @Path("/testbed/{testbedId}/snapshot/{dateTime}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSnapshotWithDateTime(@PathParam("testbedId") int testbedId, @PathParam("dateTime") String dateTime) {
        List<ItemData> itemDataTree = itemService.getSnapshot(testbedId, dateTime);

        if (itemDataTree == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("The date format passed was invalid, please provide a date in the ISO 8601 format. (2020-08-24T19:40:42.000Z)").build();
        }

        if (itemDataTree.size() == 0) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemDataTree).build();
    }

    @GET
    @Path("/item-changes/{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemChangesByItemId(@PathParam("itemId") int itemId) {
        List<ItemChanges> itemChangesList = itemService.getItemChangesByItemId(itemId);

        if (itemChangesList.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemChangesList).build();
    }

    @GET
    @Path("/item-data-map")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemDataMap() {
        Map<Integer, Map<Integer, ItemData>> itemDataMap = itemService.getItemDataMap();

        if (itemDataMap.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemDataMap).build();
    }

    @GET
    @Path("/testbed/{testbedId}/item-data")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemData(@PathParam("testbedId") int testbedId) {
        Map<Integer, ItemData> itemDataMap = itemService.getItemDataMap(testbedId);

        if (itemDataMap.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemDataMap).build();
    }

    @GET
    @Path("/items/{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemDataFlat(@PathParam("itemId") int itemId) {
        ItemData itemData = itemService.getItemDataById(itemId);

        if (itemData == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemData).build();
    }

    @GET
    @Path("/testbed/{testbedId}/items")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemDataFlat(@PathParam("testbedId") int testbedId, @QueryParam("itemId") List<Integer> itemId) {
        List<ItemData> itemDataList = itemService.getItemMetadataWithIds(testbedId, itemId);

        if (itemDataList.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemDataList).build();
    }

    @GET
    @Path("/items/find")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchItemData(@QueryParam("testbedIds") List<Integer> testbedIds, @QueryParam("searchString") String searchString) {
        List<ItemChanges> itemChanges = itemService.searchItemChangesForTestbeds(searchString, testbedIds);

        if (itemChanges.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(itemChanges).build();
    }

    @GET
    @Path("/history/{testbedId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHistory(@PathParam("testbedId") int testbedId) {
        List<ItemChanges> history = itemService.getItemChanges(testbedId);

        if (history.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(history).build();
    }

    @GET
    @Path("/image/{itemChangesId}")
    @Produces("image/png")
    public Response getImage(@PathParam("itemChangesId") int itemChangesId) {
        InputStream image = imageService.getImage(itemChangesId);

        if (image == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(image).build();
    }

    @GET
    @Path("/can-edit/{testbedId}")
    @Produces(MediaType.TEXT_PLAIN)
    public Response getCanEdit(@PathParam("testbedId") int testbedId, @Context HttpHeaders httpHeaders) {
        return Response.status(Response.Status.OK).entity(
            userService.canUserEdit(testbedService.getTestbedSettingsById(testbedId), userService.getUser(httpHeaders))).build();
    }

    @GET
    @Path("/is-admin")
    @Produces(MediaType.TEXT_PLAIN)
    public Response getAdminGroup(@Context HttpHeaders httpHeaders) {
        return Response.status(Response.Status.OK).entity(userService.isAdmin(userService.getUser(httpHeaders))).build();
    }

    @GET
    @Path("/testbed-settings")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTestbedSettings() {
        List<TestbedSettings> testbedSettings = testbedService.getTestbedSettings();

        if (testbedSettings.isEmpty()) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(testbedSettings).build();
    }

    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@Context HttpHeaders headers) {
        return Response.status(Response.Status.OK).entity(userService.getUser(headers)).build();
    }

    @POST
    @Path("/image/{itemChangeId}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postImage(@PathParam("itemChangeId") int itemChangeId,
                              @FormDataParam("file") InputStream uploadedInputStream) {
        imageService.saveImage(itemChangeId, uploadedInputStream);

        return Response.status(Response.Status.CREATED).build();
    }

    @POST
    @Path("/item-changes/{itemId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postItemChanges(@PathParam("itemId") int itemId, ItemChanges itemChanges) {
        if (itemChanges == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        ItemChanges newItemChanges = itemService.postItemChange(itemId, itemChanges);

        if (newItemChanges == null) {
            return Response.status(Response.Status.FORBIDDEN).entity("Item is locked, so it cannot be modified").build();
        }

        // Only try to send an email if we're running in production.
        if (productionFlag) {
            ItemData itemData = itemService.getItemDataById(itemId);
            Testbed testbed = testbedService.getTestbedById(itemData.getTestbedId());
            TestbedSettings testbedSettings = testbedService.getTestbedSettingsById(testbed.getId());

            // If the testbed doesn't have an email notification list set, then we don't try and send an email.
            List<ItemChanges> history = itemService.getItemChangesByItemId(itemId);

            List<String> emailNotificationList = testbedSettings.getEmailNotificationsList() == null ? new ArrayList<>()
                    : Arrays.asList(testbedSettings.getEmailNotificationsList().split(","));
            mailService.sendMail(emailNotificationList, history, itemData, testbed);
        }

        return Response.status(Response.Status.OK).entity(newItemChanges).build();
    }

    @POST
    @Path("/item-structure")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response postStructureUpdate(JsonStructure structure) {
        Testbed testbed = testbedService.postTestbed(structure);

        // If the API was not a passed a structure or the testbedId is still -1, there was an issue.
        if (testbed == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(testbed).build();
    }

    @PUT
    @Path("/item-data/{itemId}/description")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public Response putItemDescription(@PathParam("itemId") int itemId, String description) {
        String savedDescription = itemService.putItemDescription(description, itemId);

        if (savedDescription == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(savedDescription).build();
    }

    @PUT
    @Path("/testbed/{testbedId}/description")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.TEXT_PLAIN)
    public Response putTestbedDescription(@PathParam("testbedId") int testbedId, String description) {
        String savedDescription = testbedService.putTestbedDescription(description, testbedId);

        if (savedDescription == null) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }

        return Response.status(Response.Status.OK).entity(savedDescription).build();
    }

    @PUT
    @Path("/toggle-online/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response putToggleOnline(@PathParam("id") int id, ItemData itemData) {
        itemService.toggleOnline(itemData);

        return Response.status(Response.Status.OK).entity(itemData).build();
    }

}

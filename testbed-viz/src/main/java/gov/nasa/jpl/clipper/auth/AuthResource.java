package gov.nasa.jpl.clipper.auth;

import gov.nasa.jpl.clipper.auth.service.AuthService;
import gov.nasa.jpl.clipper.auth.service.AuthServiceImpl;
import gov.nasa.jpl.clipper.model.*;
import gov.nasa.jpl.clipper.service.*;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("auth/v1/")
public class AuthResource {
    private final AuthService authService;
    private final ItemService itemService;
    private final UserService userService;

    public AuthResource() {
        authService = new AuthServiceImpl();
        itemService = new ItemServiceImpl();
        userService = new UserServiceImpl();
    }

    @GET
    @Path("/item-changes-history")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemChangesHistory(@Context HttpHeaders headers) {
        if (userService.isAdmin(userService.getUser(headers))) {
            List<ItemChangesHistory> itemChangesHistoryList = authService.getItemChangesHistory();

            if (itemChangesHistoryList.isEmpty()) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.OK).entity(itemChangesHistoryList).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }
  
    @GET
    @Path("/item-data-history")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getItemMetadataHistory(@Context HttpHeaders headers) {
        if (userService.isAdmin(userService.getUser(headers))) {
            List<ItemMetadataHistory> itemMetadataHistoryList = authService.getItemMetadataHistory();

            if (itemMetadataHistoryList.isEmpty()) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.OK).entity(itemMetadataHistoryList).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @POST
    @Path("/delete/{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putToggleDeleted(@Context HttpHeaders headers, @PathParam("itemId") int itemId, boolean deleted) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            return Response.status(Response.Status.OK).entity(authService.updateDeleted(deleted, itemService.getItemDataById(itemId), user.getUserId())).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @POST
    @Path("/item-data")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postItemData(@Context HttpHeaders headers, ItemData itemData) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            ItemData createdItemData = authService.createItemData(itemData, user.getUserId());

            if (createdItemData == null) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.CREATED).entity(itemData).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @POST
    @Path("/item-status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response postItemStatus(@Context HttpHeaders headers, ItemStatus itemStatus) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            ItemStatus createdItemStatus = authService.createItemStatus(itemStatus, user.getUserId());

            if (createdItemStatus == null) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.CREATED).entity(createdItemStatus).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @POST
    @Path("/delete-item-change/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putToggleDeleted(@Context HttpHeaders headers, @PathParam("id") int id) {
        User user = userService.getUser(headers);
        ItemChanges itemChanges = itemService.getItemChangesById(id);

        if (userService.isAdmin(user) || itemChanges.getUsername().equalsIgnoreCase(user.getUserId())) {
            return Response.status(Response.Status.OK).entity(authService.deleteItemChanges(itemChanges, user.getUserId())).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @PUT
    @Path("/item-change")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putItemChanges(@Context HttpHeaders headers, ItemChanges itemChanges) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user) || itemChanges.getUsername().equalsIgnoreCase(user.getUserId())) {
            ItemChanges updatedItemChanges = authService.updateItemChanges(itemChanges, user.getUserId());

            if (updatedItemChanges == null) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.OK).entity(updatedItemChanges).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @PUT
    @Path("/item-data")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putItemData(@Context HttpHeaders headers, ItemData itemData) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            ItemData updatedItemData = authService.updateItemData(itemData, user.getUserId());

            if (updatedItemData == null) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.OK).entity(updatedItemData).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @PUT
    @Path("/item-status")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putItemStatus(@Context HttpHeaders headers, ItemStatus itemStatus) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            ItemStatus updatedItemStatus = authService.updateItemStatus(itemStatus, user.getUserId());

            if (updatedItemStatus == null) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.OK).entity(updatedItemStatus).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @PUT
    @Path("/testbed-settings")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putTestbedSettings(@Context HttpHeaders headers, TestbedSettings testbedSettings) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            TestbedSettings updatedTestbedSettings = authService.updateTestbedSettings(testbedSettings, user.getUserId());

            if (updatedTestbedSettings == null) {
                return Response.status(Response.Status.NO_CONTENT).build();
            }

            return Response.status(Response.Status.OK).entity(testbedSettings).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @PUT
    @Path("/testbed/{testbedId}/sort-order")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putSortOrder(@Context HttpHeaders headers, @PathParam("testbedId") int testbedId, Integer sortOrder) {
        if (userService.isAdmin(userService.getUser(headers))) {
            Integer updatedSortOrder = authService.updateSortOrder(sortOrder, testbedId);

            return Response.status(Response.Status.OK).entity(updatedSortOrder).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }

    @PUT
    @Path("/toggle-lock/{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response putToggleLock(@Context HttpHeaders headers, @PathParam("itemId") int itemId, boolean locked) {
        User user = userService.getUser(headers);

        if (userService.isAdmin(user)) {
            return Response.status(Response.Status.OK).entity(authService.updateLocked(locked, itemService.getItemDataById(itemId), user.getUserId())).build();
        }

        return Response.status(Response.Status.FORBIDDEN).build();
    }
}

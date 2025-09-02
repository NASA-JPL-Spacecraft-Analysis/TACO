package gov.nasa.jpl.clipper.service;

import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.model.User;

import javax.ws.rs.core.HttpHeaders;

public interface UserService {
    boolean canUserEdit(TestbedSettings testbedSettings, User user);

    User getUser(HttpHeaders headers);

    boolean isAdmin(User user);
}

package gov.nasa.jpl.clipper;

import gov.nasa.jpl.clipper.auth.AuthResource;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.ApplicationPath;

@ApplicationPath("api")
public class TestbedVizApplication extends ResourceConfig {
    public TestbedVizApplication() {
        register(MultiPartFeature.class);
        register(CorsFilter.class);
        register(AuthResource.class);
        register(TestbedVizResource.class);
    }
}

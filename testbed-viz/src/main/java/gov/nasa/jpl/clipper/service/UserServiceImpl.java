package gov.nasa.jpl.clipper.service;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import gov.nasa.jpl.clipper.model.TestbedSettings;
import gov.nasa.jpl.clipper.model.User;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.lang.reflect.Type;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.*;

public class UserServiceImpl implements UserService {

    public UserServiceImpl() {}

    @Override
    public boolean canUserEdit(TestbedSettings testbedSettings, User user) {
        if (testbedSettings.getTestbedEditGroup() == null || testbedSettings.getTestbedEditGroup().equals("")) {
            return true;
        }

        String[] editGroups = testbedSettings.getTestbedEditGroup().split(",");
        Set<String> editGroupSet = new HashSet<>();
        Collections.addAll(editGroupSet, editGroups);

        for (String group : user.getGroupList()) {
            // If the user is part of ANY listed LDAP group, they can edit.
            if (editGroupSet.contains(group.trim())) {
                return true;
            }
        }

        return false;
    }

    private User getUserUsingCookie(HttpHeaders headers) {

        String camCookieName = System.getenv("CAM_COOKIE_NAME");
        String camUrl = System.getenv("CAM_URL");

        if (Objects.equals(camCookieName, "") || Objects.equals(camUrl, "")) {
            return null;
        }

        try {
            Cookie camCookie = headers.getCookies().get(camCookieName);
            TrustManager[] trustManager = new X509TrustManager[] { new X509TrustManager() {

                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

                @Override
                public void checkClientTrusted(X509Certificate[] certs, String authType) {}

                @Override
                public void checkServerTrusted(X509Certificate[] certs, String authType) {}
            }};

            SSLContext sslContext = SSLContext.getInstance("SSL");
            sslContext.init(null, trustManager, null);

            Client client = ClientBuilder.newBuilder().sslContext(sslContext).build();
            WebTarget webTarget = client.target(camUrl + "/cam-api/userProfile");

            String json = "{\"ssoToken\": \"" + camCookie.getValue() + "\"}";

            Response response = webTarget
                    .request()
                    .accept(MediaType.APPLICATION_JSON)
                    .post(Entity.entity(json, MediaType.APPLICATION_JSON));

            Gson gson = new Gson();

            return gson.fromJson(response.readEntity(String.class), User.class);
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
        }

        return null;

    }

    public User getUserFromProxy(HttpHeaders headers) {
        String sub = headers.getHeaderString("X-Sub");
        String groupsEncoded = headers.getHeaderString("X-Groups");
        System.out.println(sub + " " + groupsEncoded);
        String groupsDecoded = new String(Base64.getDecoder().decode(groupsEncoded));

        Gson gson = new Gson();
        Type groupMapType = new TypeToken<Map<String, Boolean>>() {}.getType();
        Map<String, Boolean> groupMap = gson.fromJson(groupsDecoded, groupMapType);
        if (groupMap == null) {
            return null;
        }

        List<String> groups = new ArrayList<>();
        for (String group: groupMap.keySet()) {
            if(groupMap.get(group)) {
                groups.add(group);
            }
        }


        return new User(groups, sub, groups, sub);

    }

    public User getUser(HttpHeaders headers) {
        String auth = System.getenv("AUTH");

        if (auth.equals("CSSO_PROXY")) {
            return getUserFromProxy(headers);
        } else if (auth.equals("CAM")) {
            return getUserUsingCookie(headers);
        } else if (auth.equals("NO_AUTH")) {
            System.out.println("Default uSER");
            return new User(new ArrayList<>(), "", new ArrayList<>(), "");
        } else {
            return null;
        }
    }

    @Override
    public boolean isAdmin(User user) {
        String auth = System.getenv("AUTH");
        if (auth.equals("NO_AUTH")) {
            return true;
        }

        String adminGroup = System.getenv("ADMIN_GROUP");

        for (String userGroup : user.getGroupList()) {
            if (userGroup.equals(adminGroup)) {
                return true;
            }
        }

        return false;
    }
}

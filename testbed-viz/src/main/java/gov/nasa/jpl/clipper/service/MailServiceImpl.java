package gov.nasa.jpl.clipper.service;

import com.google.gson.Gson;
import gov.nasa.jpl.clipper.model.*;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Properties;

public class MailServiceImpl implements MailService {
    /**
     * Send an email notification, this will be skipped if the application
     * doesn't have a mail list configured.
     * @param emailNotificationsList The email that we're going to send the change to.
     * @param history The list of changes that have been made to this item.
     * @param itemData The item that was changed.
     * @param testbed The testbed that contains the item that was changed.
     */
    @Override
    public void sendMail(List<String> emailNotificationsList, List<ItemChanges> history, ItemData itemData, Testbed testbed) {
        String email = System.getenv("EMAIL");

        if (email.equals("SMTP")) {
            sendAllMailSmtp(emailNotificationsList, history, itemData, testbed);
        } else if (email.equals("HTTP_CSSO")) {
            CssoResponse session = getCssoSession();
            sendMailHttpCsso(session, emailNotificationsList, history, itemData, testbed);
        } else {
            return;
        }
    }

    private CssoResponse getCssoSession() {
        Client client = ClientBuilder.newBuilder().build();
        WebTarget webTarget = client.target(System.getenv("EMAIL_CSSO_URL"));

        Response response = webTarget
                .request()
                .header("X-Sub", System.getenv("EMAIL_CSSO_SUB"))
                .header("X-Password", System.getenv("EMAIL_CSSO_PWD"))
                .accept(MediaType.APPLICATION_JSON)
                .post(Entity.entity(null, MediaType.APPLICATION_JSON));

        Gson gson = new Gson();

        return gson.fromJson(response.readEntity(String.class), CssoResponse.class);
    }


    private void sendMailHttpCsso(CssoResponse session, List<String> emailNotificationsList, List<ItemChanges> history, ItemData itemData, Testbed testbed) {
        String appUrl = System.getenv("APP_URL");
        String emailFrom = System.getenv("EMAIL_FROM");
        String emailSubject = "[TACO] " + testbed.getName() + " Was Updated";

        Client client = ClientBuilder.newBuilder().build();
        WebTarget webTarget = client.target(System.getenv("EMAIL_SRL_URL"));

        SrlMailRequest data = new SrlMailRequest(
                "text/html",
                emailNotificationsList,
                emailFrom,
                emailSubject,
                generateContent(appUrl, history, itemData, testbed)
        );

        Gson gson = new Gson();

        Response response = webTarget
                .request()
                .cookie(session.getTokenName(), session.getSessionToken())
                .accept(MediaType.APPLICATION_JSON)
                .post(Entity.entity(gson.toJson(data), MediaType.APPLICATION_JSON));
    }


    private void sendAllMailSmtp(List<String> emailNotificationsList, List<ItemChanges> history, ItemData itemData, Testbed testbed) {
        for (String email: emailNotificationsList) {
            sendMailSmtp(email, history, itemData, testbed);
        }
    }

    private void sendMailSmtp(String emailNotificationsList, List<ItemChanges> history, ItemData itemData, Testbed testbed) {
        String mailHost = "smtp.jpl.nasa.gov";
        String appUrl = System.getenv("APP_URL");

        Properties props = System.getProperties();

        props.put("mail.smtp.host", mailHost);

        Session session = Session.getDefaultInstance(props);
        Message message = new MimeMessage(session);

        try {
            message.setFrom(new InternetAddress(emailNotificationsList));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(emailNotificationsList));
            message.setSubject("[TACO] " + testbed.getName() + " Was Updated");
            message.setContent(generateContent(appUrl, history, itemData, testbed), "text/html");

            Transport.send(message);
        } catch (MessagingException exception) {
            exception.printStackTrace();
        }
    }

    private String generateContent(String appUrl, List<ItemChanges> history, ItemData itemData, Testbed testbed) {
        ItemChanges newChange = history.get(0);
        List<ItemStatus> statuses = testbed.getStatuses();

        String body = "<html><head>"
            + "<style>table, th, td { border: 1px solid black; border-collapse: collapse; }</style>"
            + "</head>\n<body>\n";

        String name;

        if (itemData.getFullname() != null) {
            name = itemData.getName() + " (" + itemData.getFullname() + ")";
        } else {
            name = itemData.getName();
        }

        body += "<h2>" + name + "</h2>\n" +
                "<p>" + name + " was updated by " + newChange.getUsername() + ".</p>\n";

        // If we have more than 1 history entry, also send the last change.
        if (history.size() > 1) {
            body += addItemDetails(history.get(1), newChange, statuses);
        } else {
            body += addItemDetails(null, newChange, statuses);
        }

        if (appUrl != null) {
            body += "<p>To see the changed item, click <a href=\"" +
                    appUrl + "/testbed/" + testbed.getId() + "/item/" + itemData.getId() +
                    "\">here</a>.</p>";
        }

        body += "</body>\n</html>";

        return body;
    }

    private String addItemDetails(ItemChanges before, ItemChanges after, List<ItemStatus> statuses) {
        String body = "<table>"
                    + "<tr>"
                    + "<th>Property</th>"
                    + "<th>Before</th>"
                    + "<th>After</th>"
                    + "</tr><tr><td>Description</td>";

        if (before != null) {
            body += "<td>" + before.getDescription() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getDescription() + "</td>"
                + "</tr><tr><td>Status</td>";

        if (before != null) {
            body += "<td>" + getStatus(before.getStatus(), statuses) + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + getStatus(after.getStatus(), statuses) + "</td>"
                + "</tr><tr><td>Version</td>";

        if (before != null) {
            body += "<td>" + before.getVersion() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getVersion() + "</td>"
                + "</tr><tr><td>Serial Number</td>";

        if (before != null) {
            body += "<td>" + before.getSerialNumber() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getSerialNumber() + "</td>"
                + "</tr><tr><td>Part Number</td>";

        if (before != null) {
            body += "<td>" + before.getPartNumber() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getPartNumber() + "</td>"
                + "</tr><tr><td>Updated By</td>";

        if (before != null) {
            body += "<td>" + before.getUsername() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getUsername() + "</td>"
                + "</tr><tr><td>Rationale</td>";

        if (before != null) {
            body += "<td>" + before.getRationale() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getRationale() + "</td>"
                + "</tr><tr><td>Updated At</td>";

        if (before != null) {
            body += "<td>" + before.getUpdated() + "</td>";
        } else {
            body += "<td></td>";
        }

        body += "<td>" + after.getUpdated() + "</td>"
                + "</tr></table>";

        return body;
    }

    private String getStatus(String statusString, List<ItemStatus> statuses) {
        if (statusString != null) {
            int statusId = Integer.parseInt(statusString);

            // Special case for our not present id.
            if (statusId == -1) {
                return "Not Present/Absent";
            }

            for (ItemStatus status: statuses) {
                if (status.getId() == statusId) {
                    return status.getStatus();
                }
            }
        }

        return "";
    }
}

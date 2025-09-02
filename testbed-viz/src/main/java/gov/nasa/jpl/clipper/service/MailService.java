package gov.nasa.jpl.clipper.service;

import gov.nasa.jpl.clipper.model.ItemChanges;
import gov.nasa.jpl.clipper.model.ItemData;
import gov.nasa.jpl.clipper.model.Testbed;

import java.util.List;

public interface MailService {
    void sendMail(List<String> emailNotificationsList, List<ItemChanges> history, ItemData itemData, Testbed testbed);
}

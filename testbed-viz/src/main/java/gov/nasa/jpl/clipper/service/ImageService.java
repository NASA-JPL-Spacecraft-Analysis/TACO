package gov.nasa.jpl.clipper.service;

import java.io.File;
import java.io.InputStream;

public interface ImageService {
    InputStream getImage(int itemChangesId);

    void saveImage(int itemChangeId, InputStream inputStream);
}

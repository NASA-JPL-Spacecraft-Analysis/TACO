package gov.nasa.jpl.clipper.service;

import gov.nasa.jpl.clipper.dao.ItemDao;
import gov.nasa.jpl.clipper.dao.ItemDaoImpl;

import java.io.*;

public class ImageServiceImpl implements ImageService {
    private final ItemDao itemDao;

    public ImageServiceImpl() {
        itemDao = new ItemDaoImpl();
    }

    @Override
    public InputStream getImage(int itemChangesId) {
        return this.itemDao.getImage(itemChangesId);
    }

    @Override
    public void saveImage(int itemChangeId, InputStream inputStream) {
        this.itemDao.saveImage(itemChangeId, inputStream);
    }
}

package gov.nasa.jpl.clipper.model;

import java.io.Serializable;
import java.util.Objects;

public class ItemChanges implements Serializable {
    private String description;
    private Integer id;
    private boolean image;
    private Integer itemId;
    private boolean online;
    private String partNumber;
    private String rationale;
    private String serialNumber;
    private String status;
    private String version;
    private String updated;
    private String username;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getItemId() {
        return itemId;
    }

    public void setItemId(Integer itemId) {
        this.itemId = itemId;
    }

    public boolean getOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(String partNumber) {
        this.partNumber = partNumber;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public String getRationale() {
        return rationale;
    }

    public void setImage(boolean image) {
        this.image = image;
    }

    public boolean getImage() {
        return image;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ItemChanges)) return false;
        ItemChanges that = (ItemChanges) o;
        return image == that.image &&
                itemId.equals(that.itemId) &&
                Objects.equals(status, that.status) &&
                Objects.equals(description, that.description) &&
                Objects.equals(version, that.version) &&
                Objects.equals(serialNumber, that.serialNumber) &&
                Objects.equals(partNumber, that.partNumber) &&
                Objects.equals(updated, that.updated) &&
                Objects.equals(rationale, that.rationale);
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemId, status, description, version, serialNumber, partNumber, updated, username, rationale, image);
    }
}

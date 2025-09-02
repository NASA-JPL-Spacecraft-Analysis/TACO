package gov.nasa.jpl.clipper.model;

import java.util.List;

public class User {
    private List<String> filteredGroupList;
    private String fullName;
    private List<String> groupList;
    private String userId;

    public User(List<String> filteredGroupList, String fullName, List<String> groupList, String userId) {
        this.filteredGroupList = filteredGroupList;
        this.fullName = fullName;
        this.groupList = groupList;
        this.userId = userId;
    }

    public List<String> getFilteredGroupList() {
        return filteredGroupList;
    }

    public void setFilteredGroupList(List<String> filteredGroupList) {
        this.filteredGroupList = filteredGroupList;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public List<String> getGroupList() {
        return groupList;
    }

    public void setGroupList(List<String> groupList) {
        this.groupList = groupList;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}

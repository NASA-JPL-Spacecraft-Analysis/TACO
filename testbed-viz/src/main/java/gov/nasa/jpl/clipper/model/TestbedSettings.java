package gov.nasa.jpl.clipper.model;

public class TestbedSettings {
    private int id;
    private int testbedId;
    private String emailNotificationsList;
    private boolean recentlyChangedIndicatorEnabled;
    private Integer recentlyChangedIndicatorDays;
    private boolean autoRefreshEnabled;
    private Integer autoRefreshInterval;
    private String testbedEditGroup;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTestbedId() {
        return testbedId;
    }

    public void setTestbedId(int testbedId) {
        this.testbedId = testbedId;
    }

    public String getEmailNotificationsList() {
        return emailNotificationsList;
    }

    public void setEmailNotificationsList(String emailNotificationsList) {
        this.emailNotificationsList = emailNotificationsList;
    }

    public boolean getRecentlyChangedIndicatorEnabled() {
        return recentlyChangedIndicatorEnabled;
    }

    public void setRecentlyChangedIndicatorEnabled(boolean recentlyChangedIndicatorEnabled) {
        this.recentlyChangedIndicatorEnabled = recentlyChangedIndicatorEnabled;
    }

    public Integer getRecentlyChangedIndicatorDays() {
        return recentlyChangedIndicatorDays;
    }

    public void setRecentlyChangedIndicatorDays(Integer recentlyChangedIndicatorDays) {
        this.recentlyChangedIndicatorDays = recentlyChangedIndicatorDays;
    }

    public boolean isRecentlyChangedIndicatorEnabled() {
        return recentlyChangedIndicatorEnabled;
    }

    public boolean getAutoRefreshEnabled() {
        return autoRefreshEnabled;
    }

    public void setAutoRefreshEnabled(boolean autoRefreshEnabled) {
        this.autoRefreshEnabled = autoRefreshEnabled;
    }

    public Integer getAutoRefreshInterval() {
        return autoRefreshInterval;
    }

    public void setAutoRefreshInterval(Integer autoRefreshInterval) {
        this.autoRefreshInterval = autoRefreshInterval;
    }
 
    public String getTestbedEditGroup() {
        return testbedEditGroup;
    }

    public void setTestbedEditGroup(String testbedEditGroup) {
        this.testbedEditGroup = testbedEditGroup;
    }
}

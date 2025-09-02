package gov.nasa.jpl.clipper.model;

import com.google.gson.annotations.SerializedName;

public class CssoResponse {
    @SerializedName("session_token")
    private String sessionToken;
    private String success;
    private String expiration;
    @SerializedName("token_name")
    private String tokenName;

    public CssoResponse(String sessionToken, String success, String expiration, String tokenName) {
        this.sessionToken = sessionToken;
        this.success = success;
        this.expiration = expiration;
        this.tokenName = tokenName;
    }

    public String getTokenName() {
        return tokenName;
    }

    public void setTokenName(String tokenName) {
        this.tokenName = tokenName;
    }

    public String getExpiration() {
        return expiration;
    }

    public void setExpiration(String expiration) {
        this.expiration = expiration;
    }

    public String getSuccess() {
        return success;
    }

    public void setSuccess(String success) {
        this.success = success;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }
}

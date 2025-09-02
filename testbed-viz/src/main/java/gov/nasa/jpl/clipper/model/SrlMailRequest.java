package gov.nasa.jpl.clipper.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class SrlMailRequest {
    @SerializedName("content_type")
    public String contentType;
    public List<String> to;
    public String from;
    public String subject;
    public String body;

    public SrlMailRequest(String contentType, List<String> to, String from, String subject, String body) {
        this.contentType = contentType;
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.body = body;
    }

    public List<String> getTo() {
        return to;
    }

    public void setTo(List<String> to) {
        this.to = to;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}

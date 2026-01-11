package com.example.MobileStorageManagement.DTO;

import java.util.List;

public class NotificationRequest {
    private String title;
    private String notificationType;
    private String content;
    private List<Integer> userIds;
    private List<String> roles;
    private Boolean sendToAll;

    public NotificationRequest(String title, String notificationType, String content, List<Integer> userIds, List<String> roles, Boolean sendToAll) {
        this.title = title;
        this.notificationType = notificationType;
        this.content = content;
        this.userIds = userIds;
        this.roles = roles;
        this.sendToAll = sendToAll;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<Integer> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<Integer> userIds) {
        this.userIds = userIds;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Boolean getSendToAll() {
        return sendToAll;
    }

    public void setSendToAll(Boolean sendToAll) {
        this.sendToAll = sendToAll;
    }
}

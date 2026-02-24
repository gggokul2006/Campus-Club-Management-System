package com.examly.springapp.model;

import java.time.LocalDate;

public class EventDTO {
    private String eventName;
    private String description;
    private LocalDate date;
    private String status;
    private Long organizerId;  // Only the club ID

    // Getters and Setters
    public String getEventName() {
        return eventName;
    }
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public LocalDate getDate() {
        return date;
    }
    public void setDate(LocalDate date) {
        this.date = date;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Long getOrganizerId() {
        return organizerId;
    }
    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }
}

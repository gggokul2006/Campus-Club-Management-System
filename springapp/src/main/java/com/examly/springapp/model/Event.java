package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventName;
    private String description;
    private LocalDate date;
    private String status;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club organizer;

    // Users who registered for this event
    @ElementCollection
    private Set<String> registeredUsers = new HashSet<>();

    // Feedbacks: key = userEmail, value = rating
    @ElementCollection
    private Map<String, Integer> feedbacks = new HashMap<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Club getOrganizer() { return organizer; }
    public void setOrganizer(Club organizer) { this.organizer = organizer; }

    public Set<String> getRegisteredUsers() { return registeredUsers; }
    public void setRegisteredUsers(Set<String> registeredUsers) { this.registeredUsers = registeredUsers; }

    public Map<String, Integer> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(Map<String, Integer> feedbacks) { this.feedbacks = feedbacks; }
}

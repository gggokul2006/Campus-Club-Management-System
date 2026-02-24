package com.examly.springapp.service;

import com.examly.springapp.model.Club;
import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventDTO;
import com.examly.springapp.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ClubService clubService;

    public EventService(EventRepository eventRepository, ClubService clubService) {
        this.eventRepository = eventRepository;
        this.clubService = clubService;
    }

    // CRUD: Add event
    public Event addEvent(EventDTO eventDTO) {
        Club organizer = clubService.getClubById(eventDTO.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        Event event = new Event();
        event.setEventName(eventDTO.getEventName());
        event.setDescription(eventDTO.getDescription());
        event.setDate(eventDTO.getDate());
        event.setStatus(eventDTO.getStatus());
        event.setOrganizer(organizer);

        return eventRepository.save(event);
    }

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

// Get event by ID
public Optional<Event> getEventById(Long id) {
return eventRepository.findById(id);
}

// Update event
public Event updateEvent(Long id, EventDTO eventDTO) {
return eventRepository.findById(id)
.map(event -> {
Club organizer = clubService.getClubById(eventDTO.getOrganizerId())
.orElseThrow(() -> new RuntimeException("Club not found"));

event.setEventName(eventDTO.getEventName());
event.setDescription(eventDTO.getDescription());
event.setDate(eventDTO.getDate());
event.setStatus(eventDTO.getStatus());
event.setOrganizer(organizer);

return eventRepository.save(event);
})
.orElseThrow(() -> new RuntimeException("Event not found"));
}

// Delete event
public void deleteEvent(Long id) {
eventRepository.deleteById(id);
}

// ✅ Register user for event
public String registerForEvent(Long eventId, String userEmail) {
Event event = eventRepository.findById(eventId)
.orElseThrow(() -> new RuntimeException("Event not found"));

if (event.getRegisteredUsers().contains(userEmail)) {
return "Already registered";
}

event.getRegisteredUsers().add(userEmail);
eventRepository.save(event);

System.out.println("Notification: " + userEmail + " registered for event " + event.getEventName());
return "Registration successful";
}

// ✅ Submit feedback
public String submitFeedback(Long eventId, String userEmail, int rating) {
Event event = eventRepository.findById(eventId)
.orElseThrow(() -> new RuntimeException("Event not found"));

if (!event.getRegisteredUsers().contains(userEmail)) {
return "You must register before submitting feedback";
}

event.getFeedbacks().put(userEmail, rating);
eventRepository.save(event);

System.out.println("Feedback: " + rating + " stars from " + userEmail + " for event " + event.getEventName());
return "Feedback submitted";
}

// List events by club
public List<Event> getEventsByClub(Long clubId) {
return eventRepository.findByOrganizerId(clubId);
}
}
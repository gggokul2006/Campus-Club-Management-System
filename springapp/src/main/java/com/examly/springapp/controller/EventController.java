package com.examly.springapp.controller;

import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventDTO;
import com.examly.springapp.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "https://8081-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // CRUD endpoints
    @GetMapping
    public List<Event> getAllEvents() { return eventService.getAllEvents(); }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventService.getEventById(id).orElse(null);
    }

    @PostMapping
    public Event addEvent(@RequestBody EventDTO eventDTO) { return eventService.addEvent(eventDTO); }

    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
        return eventService.updateEvent(id, eventDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted with id " + id;
    }

    // ✅ Register for event
    @PostMapping("/{eventId}/register")
    public String registerEvent(@PathVariable Long eventId, @RequestParam String userEmail) {
        return eventService.registerForEvent(eventId, userEmail);
    }

    // ✅ Submit feedback
    @PostMapping("/{eventId}/feedback")
    public String submitFeedback(@PathVariable Long eventId,
                                 @RequestParam String userEmail,
                                 @RequestParam int rating) {
        return eventService.submitFeedback(eventId, userEmail, rating);
    }

    // List events by club
    @GetMapping("/byClub/{clubId}")
    public List<Event> getEventsByClub(@PathVariable Long clubId) {
        return eventService.getEventsByClub(clubId);
    }
}

package com.examly.springapp.controller;

import com.examly.springapp.model.Announcement;
import com.examly.springapp.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins = "https://8081-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io/") // allow frontend
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    // get all announcements
    @GetMapping
    public List<Announcement> getAll() {
        return announcementService.getAllAnnouncements();
    }

    // get announcements by club
    @GetMapping("/club/{clubId}")
    public List<Announcement> getByClub(@PathVariable Long clubId) {
        return announcementService.getByClub(clubId);
    }

    // add new announcement (admin/club leader only)
    @PostMapping
    public Announcement addAnnouncement(@RequestBody Announcement announcement) {
        return announcementService.addAnnouncement(announcement);
    }
    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
    try {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted successfully"));
    } catch (RuntimeException e) {
        return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
    }
}
}

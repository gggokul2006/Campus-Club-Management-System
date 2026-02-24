package com.examly.springapp.service;

import com.examly.springapp.model.Announcement;
import com.examly.springapp.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public List<Announcement> getByClub(Long clubId) {
        return announcementRepository.findByClubId(clubId);
    }

    public Announcement addAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
     // ✅ Delete announcement by ID
    public void deleteAnnouncement(Long id) {
        if (announcementRepository.existsById(id)) {
            announcementRepository.deleteById(id);
        } else {
            throw new RuntimeException("Announcement not found with ID: " + id);
        }
    }
}

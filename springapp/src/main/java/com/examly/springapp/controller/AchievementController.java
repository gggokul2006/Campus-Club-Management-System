package com.examly.springapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.examly.springapp.model.Achievement;
import com.examly.springapp.service.AchievementService;
import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService service;

    public AchievementController(AchievementService service) {
        this.service = service;
    }

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return service.getAllAchievements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Achievement> getAchievementById(@PathVariable Long id) {
        return service.getAchievementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    public List<Achievement> getAchievementsByStudent(@PathVariable Long studentId) {
        return service.getAchievementsByStudent(studentId);
    }

    @GetMapping("/club/{clubId}")
    public List<Achievement> getAchievementsByClub(@PathVariable Long clubId) {
        return service.getAchievementsByClub(clubId);
    }

    // ✅ NEW: Get by both student and club
    @GetMapping("/student/{studentId}/club/{clubId}")
    public List<Achievement> getAchievementsByStudentAndClub(@PathVariable Long studentId, @PathVariable Long clubId) {
        return service.getAchievementsByStudentAndClub(studentId, clubId);
    }

    @PostMapping
    public Achievement createAchievement(@RequestBody Achievement achievement) {
        return service.createAchievement(achievement);
    }

    // ✅ NEW: Create for student & club
    @PostMapping("/student/{studentId}/club/{clubId}")
    public Achievement createAchievementForStudentAndClub(
            @PathVariable Long studentId,
            @PathVariable Long clubId,
            @RequestBody Achievement achievement) {
        return service.createAchievementForStudentAndClub(studentId, clubId, achievement);
    }

    @PutMapping("/{id}")
    public Achievement updateAchievement(@PathVariable Long id, @RequestBody Achievement achievement) {
        return service.updateAchievement(id, achievement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAchievement(@PathVariable Long id) {
        service.deleteAchievement(id);
        return ResponseEntity.noContent().build();
    }
}

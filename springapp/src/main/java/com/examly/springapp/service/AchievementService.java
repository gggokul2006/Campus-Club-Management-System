package com.examly.springapp.service;

import com.examly.springapp.model.Achievement;
import java.util.List;
import java.util.Optional;

public interface AchievementService {
    List<Achievement> getAllAchievements();
    Optional<Achievement> getAchievementById(Long id);
    List<Achievement> getAchievementsByStudent(Long studentId);
    List<Achievement> getAchievementsByClub(Long clubId);
    List<Achievement> getAchievementsByStudentAndClub(Long studentId, Long clubId);
    Achievement createAchievement(Achievement achievement);
    Achievement createAchievementForStudentAndClub(Long studentId, Long clubId, Achievement achievement);
    Achievement updateAchievement(Long id, Achievement achievement);
    void deleteAchievement(Long id);
}

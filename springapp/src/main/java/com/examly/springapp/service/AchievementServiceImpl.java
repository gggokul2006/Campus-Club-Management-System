package com.examly.springapp.service;

import com.examly.springapp.model.Achievement;
import com.examly.springapp.repository.AchievementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AchievementServiceImpl implements AchievementService {

    private final AchievementRepository repository;

    public AchievementServiceImpl(AchievementRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Achievement> getAllAchievements() {
        return repository.findAll();
    }

    @Override
    public Optional<Achievement> getAchievementById(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Achievement> getAchievementsByStudent(Long studentId) {
        return repository.findByStudentId(studentId);
    }

@Override
public List<Achievement> getAchievementsByClub(Long clubId) {
return repository.findByClubId(clubId);
}

@Override
public List<Achievement> getAchievementsByStudentAndClub(Long studentId, Long clubId) {
return repository.findByStudentIdAndClubId(studentId, clubId);
}

@Override
public Achievement createAchievement(Achievement achievement) {
achievement.handleVerificationDate();
return repository.save(achievement);
}

@Override
public Achievement createAchievementForStudentAndClub(Long studentId, Long clubId, Achievement achievement) {
achievement.setStudentId(studentId);
achievement.setClubId(clubId);
achievement.handleVerificationDate();
return repository.save(achievement);
}

@Override
public Achievement updateAchievement(Long id, Achievement achievement) {
Achievement existing = repository.findById(id)
.orElseThrow(() -> new RuntimeException("Achievement not found with id " + id));

existing.setAchievementType(achievement.getAchievementType());
existing.setTitle(achievement.getTitle());
existing.setDescription(achievement.getDescription());
existing.setPointsAwarded(achievement.getPointsAwarded());
existing.setAwardDate(achievement.getAwardDate());
existing.setAwardedBy(achievement.getAwardedBy());
existing.setAcademicYear(achievement.getAcademicYear());
existing.setCertificateUrl(achievement.getCertificateUrl());
existing.setIsVerified(achievement.getIsVerified());
existing.setIsPublic(achievement.getIsPublic());

existing.handleVerificationDate();
return repository.save(existing);
}

@Override
public void deleteAchievement(Long id) {
repository.deleteById(id);
}
}
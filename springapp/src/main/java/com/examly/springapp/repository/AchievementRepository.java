package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.examly.springapp.model.Achievement;
import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByStudentId(Long studentId);
    List<Achievement> findByClubId(Long clubId);
    List<Achievement> findByStudentIdAndClubId(Long studentId, Long clubId);
    List<Achievement> findByIsVerified(Boolean isVerified);
}

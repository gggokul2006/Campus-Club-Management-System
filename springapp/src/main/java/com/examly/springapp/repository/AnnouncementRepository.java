package com.examly.springapp.repository;

import com.examly.springapp.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByClubId(Long clubId);
}

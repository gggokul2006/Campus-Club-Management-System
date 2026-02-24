package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private Long clubId;

    private String achievementType;
    private String title;
    private String description;
    private Double pointsAwarded;
    private LocalDate awardDate;
    private String awardedBy;
    private String academicYear;
    private String certificateUrl;
    private Boolean isVerified;
    private Boolean isPublic;

    // Optional: handle verification timestamp if needed
    public void handleVerificationDate() {
        if (Boolean.TRUE.equals(isVerified) && awardDate == null) {
            this.awardDate = LocalDate.now();
        }
    }

// Getters and setters
public Long getId() { return id; }
public void setId(Long id) { this.id = id; }

public Long getStudentId() { return studentId; }
public void setStudentId(Long studentId) { this.studentId = studentId; }

public Long getClubId() { return clubId; }
public void setClubId(Long clubId) { this.clubId = clubId; }

public String getAchievementType() { return achievementType; }
public void setAchievementType(String achievementType) { this.achievementType = achievementType; }

public String getTitle() { return title; }
public void setTitle(String title) { this.title = title; }

public String getDescription() { return description; }
public void setDescription(String description) { this.description = description; }

public Double getPointsAwarded() { return pointsAwarded; }
public void setPointsAwarded(Double pointsAwarded) { this.pointsAwarded = pointsAwarded; }

public LocalDate getAwardDate() { return awardDate; }
public void setAwardDate(LocalDate awardDate) { this.awardDate = awardDate; }

public String getAwardedBy() { return awardedBy; }
public void setAwardedBy(String awardedBy) { this.awardedBy = awardedBy; }

public String getAcademicYear() { return academicYear; }
public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

public String getCertificateUrl() { return certificateUrl; }
public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

public Boolean getIsVerified() { return isVerified; }
public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

public Boolean getIsPublic() { return isPublic; }
public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
}
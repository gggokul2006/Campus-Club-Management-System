package com.examly.springapp.model;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Club {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String clubName;
    @NotNull
    private String category;
    @NotBlank
    private String description;
    @NotBlank
    @Email
    private String presidentEmail;
    @NotNull
    @Min(1)
    private int memberCount;
    @NotNull
    private LocalDate establishedDate;
    @NotNull
    private String status;
    
    // ✅ new field for members
    @ElementCollection
    private Set<String> members = new HashSet<>(); // store member emails

    @ElementCollection
    private Map<String, String> memberStatus = new HashMap<>();
    // key = userEmail, value = status: PENDING / APPROVED / REJECTED


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getClubName() {
        return clubName;
    }
    public void setClubName(String clubName) {
        this.clubName = clubName;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getPresidentEmail() {
        return presidentEmail;
    }
    public void setPresidentEmail(String presidentEmail) {
        this.presidentEmail = presidentEmail;
    }
    public int getMemberCount() {
        return memberCount;
    }
    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }
    public LocalDate getEstablishedDate() {
        return establishedDate;
    }
    public void setEstablishedDate(LocalDate establishedDate) {
        this.establishedDate = establishedDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    } 
    
}

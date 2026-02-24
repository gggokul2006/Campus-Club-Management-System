package com.examly.springapp.service;

import com.examly.springapp.model.Club;
import com.examly.springapp.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClubService {

    @Autowired
    private ClubRepository clubRepository;

    public Club saveClub(Club club) {
        return clubRepository.save(club);
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public List<Club> getClubsByCategory(String category) {
        return clubRepository.findByCategory(category);
    }

    public List<Club> getClubsSortedByMemberCount() {
        return clubRepository.findAllByOrderByMemberCountDesc();
    }

    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }
    public List<Club> getClubsByMember(String userEmail) {
    return clubRepository.findAll().stream()
        .filter(c -> c.getMembers().contains(userEmail))
        .collect(Collectors.toList());
}

    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }

    // ✅ Pagination
    public Page<Club> getClubsWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return clubRepository.findAll(pageable);
    }

    public String requestJoin(Long clubId, String userEmail) {
        Club club = clubRepository.findById(clubId).orElseThrow();
        if (club.getMemberStatus().containsKey(userEmail)) {
            return "You have already requested to join!";
        }
        club.getMemberStatus().put(userEmail, "PENDING");
        clubRepository.save(club);
        System.out.println("Notification: User " + userEmail + " requested to join " + club.getClubName());
        return "Membership request sent. Waiting for admin approval.";
    }

    public String handleMembershipApproval(Long clubId, String userEmail, boolean approve) {
    Club club = clubRepository.findById(clubId).orElseThrow();
    if (!club.getMemberStatus().containsKey(userEmail)) {
        return "No pending request from user!";
    }
    club.getMemberStatus().put(userEmail, approve ? "APPROVED" : "REJECTED");

    if (approve) {
        club.getMembers().add(userEmail); // add to approved members
    }
    clubRepository.save(club);
    System.out.println("Notification: User " + userEmail + " membership " + club.getMemberStatus().get(userEmail));
    return "Membership " + (approve ? "approved" : "rejected");
}


}

package com.examly.springapp.controller;

import com.examly.springapp.model.Club;
import com.examly.springapp.service.ClubService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
 
@RestController
@CrossOrigin("https://8081-cbbdcbfcadeaaabacaabdbfafcadaacbcadfeccd.premiumproject.examly.io")
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

 
    @PostMapping("/addClub")
    public ResponseEntity<Club> addClub(@RequestBody Club club) {
        return ResponseEntity.ok(clubService.saveClub(club));
    }
    @GetMapping("/memberships")
public ResponseEntity<List<Club>> getUserMemberships(@RequestParam String userEmail) {
    List<Club> userClubs = clubService.getClubsByMember(userEmail);
    return ResponseEntity.ok(userClubs);
}


    @GetMapping("/allClubs")
    public ResponseEntity<List<Club>> getAllClubs() {
        return ResponseEntity.ok(clubService.getAllClubs());
    }

  
   @GetMapping("/{id}")
public ResponseEntity<Club> getClubById(@PathVariable Long id) {
    Club club = clubService.getClubById(id).orElseGet(() -> {
        Club emptyClub = new Club();
        emptyClub.setClubName("");
        return emptyClub;
    });
    return ResponseEntity.ok(club);
}
@PutMapping("/join/{id}")
public ResponseEntity<?> joinClub(@PathVariable Long id, @RequestParam String userEmail) {
    Optional<Club> clubOpt = clubService.getClubById(id);
    if (clubOpt.isEmpty()) return ResponseEntity.notFound().build();

    Club club = clubOpt.get();
    
    String message;
    if (club.getMembers().contains(userEmail)) {
        // User already joined → remove to leave
        club.getMembers().remove(userEmail);
        message = "Successfully left the club!";
    } else {
        // User not joined → add to join
        club.getMembers().add(userEmail);
        message = "Successfully joined the club!";
    }

    club.setMemberCount(club.getMembers().size());
    clubService.saveClub(club);

    // ✅ Return plain text message instead of JSON
    return ResponseEntity.ok(message);
}


 
    @GetMapping("/byCategory")
    public ResponseEntity<List<Club>> getClubsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(clubService.getClubsByCategory(category));
    }

    
    @GetMapping("/sortedByMemberCount")
    public ResponseEntity<List<Club>> getClubsSortedByMemberCount() {
        return ResponseEntity.ok(clubService.getClubsSortedByMemberCount());
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(@PathVariable Long id, @RequestBody Club updatedClub) {
        updatedClub.setId(id);
        return ResponseEntity.ok(clubService.saveClub(updatedClub));
    }

  
   @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        try {
            clubService.deleteClub(id);
        } catch (EmptyResultDataAccessException e) {
       
        }
        return ResponseEntity.ok().build();
    }
    
    // ✅ pagination endpoint
    @GetMapping
    public ResponseEntity<Page<Club>> getClubsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return ResponseEntity.ok(clubService.getClubsWithPagination(page, size));
    }

    // User requests to join
    @PutMapping("/requestJoin/{id}")
    public ResponseEntity<String> requestJoin(@PathVariable Long id, @RequestParam String userEmail) {
        String message = clubService.requestJoin(id, userEmail);
        return ResponseEntity.ok(message);
    }

    // Admin approves/rejects
    @PutMapping("/approveMembership/{id}")
    public ResponseEntity<String> approveMembership(
            @PathVariable Long id,
            @RequestParam String userEmail,
            @RequestParam boolean approve
    ) {
        String message = clubService.handleMembershipApproval(id, userEmail, approve);
        return ResponseEntity.ok(message);
    }


}

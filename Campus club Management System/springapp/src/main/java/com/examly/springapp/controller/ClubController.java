package com.examly.springapp.controller;

import com.examly.springapp.model.Club;
import com.examly.springapp.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

 
    @PostMapping("/addClub")
    public ResponseEntity<Club> addClub(@RequestBody Club club) {
        return ResponseEntity.ok(clubService.saveClub(club));
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
}

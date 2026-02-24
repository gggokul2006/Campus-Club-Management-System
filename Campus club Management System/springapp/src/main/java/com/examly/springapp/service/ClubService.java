package com.examly.springapp.service;

import com.examly.springapp.model.Club;
import com.examly.springapp.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    
    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }
}

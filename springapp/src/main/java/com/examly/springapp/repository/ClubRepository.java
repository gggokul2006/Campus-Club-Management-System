package com.examly.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import com.examly.springapp.model.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club,Long> {
    List<Club> findByCategory(String category);
    List<Club> findAllByOrderByMemberCountDesc();

    Page<Club> findAll(Pageable pageable);
}

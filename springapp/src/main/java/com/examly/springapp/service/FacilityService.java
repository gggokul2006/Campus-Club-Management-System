package com.examly.springapp.service;

import org.springframework.stereotype.Service;
import com.examly.springapp.model.Facility;
import com.examly.springapp.repository.FacilityRepository;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    private final FacilityRepository repository;

    public FacilityService(FacilityRepository repository) {
        this.repository = repository;
    }

    public List<Facility> getAllFacilities() {
        return repository.findAll();
    }

public Optional<Facility> getFacilityById(Long id) {
return repository.findById(id);
}

public Facility createFacility(Facility facility) {
return repository.save(facility);
}

public Facility updateFacility(Long id, Facility facilityDetails) {
Facility facility = repository.findById(id)
.orElseThrow(() -> new RuntimeException("Facility not found with id " + id));

if (facilityDetails.getFacilityName() != null) facility.setFacilityName(facilityDetails.getFacilityName());
if (facilityDetails.getBuilding() != null) facility.setBuilding(facilityDetails.getBuilding());
if (facilityDetails.getRoomNumber() != null) facility.setRoomNumber(facilityDetails.getRoomNumber());
if (facilityDetails.getLocationDescription() != null) facility.setLocationDescription(facilityDetails.getLocationDescription());
if (facilityDetails.getCapacity() != null) facility.setCapacity(facilityDetails.getCapacity());
if (facilityDetails.getFacilityType() != null) facility.setFacilityType(facilityDetails.getFacilityType());
if (facilityDetails.getEquipmentAvailable() != null) facility.setEquipmentAvailable(facilityDetails.getEquipmentAvailable());
if (facilityDetails.getAccessibilityFeatures() != null) facility.setAccessibilityFeatures(facilityDetails.getAccessibilityFeatures());
if (facilityDetails.getBookingRules() != null) facility.setBookingRules(facilityDetails.getBookingRules());
if (facilityDetails.getHourlyRate() != null) facility.setHourlyRate(facilityDetails.getHourlyRate());
if (facilityDetails.getAvailabilitySchedule() != null) facility.setAvailabilitySchedule(facilityDetails.getAvailabilitySchedule());
if (facilityDetails.getContactPerson() != null) facility.setContactPerson(facilityDetails.getContactPerson());
if (facilityDetails.getContactPhone() != null) facility.setContactPhone(facilityDetails.getContactPhone());
if (facilityDetails.getIsActive() != null) facility.setIsActive(facilityDetails.getIsActive());
if (facilityDetails.getRequiresApproval() != null) facility.setRequiresApproval(facilityDetails.getRequiresApproval());

return repository.save(facility);
}

public void deleteFacility(Long id) {
repository.deleteById(id);
}
}
package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "facilities")
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String facilityName;

    private String building;
    private String roomNumber;

    @Column(columnDefinition = "TEXT")
    private String locationDescription;

    @Column(nullable = false)
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private FacilityType facilityType;

    @Column(columnDefinition = "TEXT")
    private String equipmentAvailable; // JSON stored as String

    @Column(columnDefinition = "TEXT")
    private String accessibilityFeatures;

    @Column(columnDefinition = "TEXT")
    private String bookingRules;

    @Column(precision = 8, scale = 2)
    private BigDecimal hourlyRate = BigDecimal.valueOf(0.00);

    @Column(columnDefinition = "TEXT")
    private String availabilitySchedule;

    private String contactPerson;
    private String contactPhone;

    private Boolean isActive = true;
    private Boolean requiresApproval = false;

    // Default constructor
    public Facility() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getLocationDescription() {
        return locationDescription;
    }

    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public FacilityType getFacilityType() {
        return facilityType;
    }

  public void setFacilityType(FacilityType facilityType) {
this.facilityType = facilityType;
}

public String getEquipmentAvailable() {
return equipmentAvailable;
}

public void setEquipmentAvailable(String equipmentAvailable) {
this.equipmentAvailable = equipmentAvailable;
}

public String getAccessibilityFeatures() {
return accessibilityFeatures;
}

public void setAccessibilityFeatures(String accessibilityFeatures) {
this.accessibilityFeatures = accessibilityFeatures;
}

public String getBookingRules() {
return bookingRules;
}

public void setBookingRules(String bookingRules) {
this.bookingRules = bookingRules;
}

public BigDecimal getHourlyRate() {
return hourlyRate;
}

public void setHourlyRate(BigDecimal hourlyRate) {
this.hourlyRate = hourlyRate;
}

public String getAvailabilitySchedule() {
return availabilitySchedule;
}

public void setAvailabilitySchedule(String availabilitySchedule) {
this.availabilitySchedule = availabilitySchedule;
}

public String getContactPerson() {
return contactPerson;
}

public void setContactPerson(String contactPerson) {
this.contactPerson = contactPerson;
}

public String getContactPhone() {
return contactPhone;
}

public void setContactPhone(String contactPhone) {
this.contactPhone = contactPhone;
}

public Boolean getIsActive() {
return isActive;
}

public void setIsActive(Boolean isActive) {
this.isActive = isActive;
}

public Boolean getRequiresApproval() {
return requiresApproval;
}

public void setRequiresApproval(Boolean requiresApproval) {
this.requiresApproval = requiresApproval;
}

@Override
public String toString() {
return "Facility{" +
"id=" + id +
", facilityName='" + facilityName + '\'' +
", building='" + building + '\'' +
", roomNumber='" + roomNumber + '\'' +
", locationDescription='" + locationDescription + '\'' +
", capacity=" + capacity +
", facilityType=" + facilityType +
", equipmentAvailable='" + equipmentAvailable + '\'' +
", accessibilityFeatures='" + accessibilityFeatures + '\'' +
", bookingRules='" + bookingRules + '\'' +
", hourlyRate=" + hourlyRate +
", availabilitySchedule='" + availabilitySchedule + '\'' +
", contactPerson='" + contactPerson + '\'' +
", contactPhone='" + contactPhone + '\'' +
", isActive=" + isActive +
", requiresApproval=" + requiresApproval +
'}';
}
}
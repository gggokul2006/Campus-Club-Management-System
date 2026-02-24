package com.examly.springapp.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key - Club ID
    @Column(name = "club_id", nullable = false)
    private Long clubId;

    @Column(name = "fiscal_year", length = 9, nullable = false)
    private String fiscalYear; // e.g., "2023-2024"

    @Column(name = "allocated_amount", precision = 12, scale = 2, nullable = false)
    private BigDecimal allocatedAmount;

    @Column(name = "spent_amount", precision = 12, scale = 2)
    private BigDecimal spentAmount = BigDecimal.valueOf(0.00);

    @Column(name = "remaining_amount", precision = 12, scale = 2)
    private BigDecimal remainingAmount = BigDecimal.valueOf(0.00);

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_category", length = 20)
    private BudgetCategory budgetCategory;

    // Foreign key - approved_by (User ID)
    @Column(name = "approved_by")
    private Long approvedBy;

    private LocalDate approvalDate;

    @Column(name = "created_date", updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "last_updated", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime lastUpdated = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String notes;


// Automatically calculate remaining amount
@PrePersist
@PreUpdate
public void calculateRemaining() {
if (allocatedAmount != null && spentAmount != null) {
this.remainingAmount = allocatedAmount.subtract(spentAmount);
}
}

// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { this.id = id; }

public Long getClubId() { return clubId; }
public void setClubId(Long clubId) { this.clubId = clubId; }

public String getFiscalYear() { return fiscalYear; }
public void setFiscalYear(String fiscalYear) { this.fiscalYear = fiscalYear; }

public BigDecimal getAllocatedAmount() { return allocatedAmount; }
public void setAllocatedAmount(BigDecimal allocatedAmount) { this.allocatedAmount = allocatedAmount; }

public BigDecimal getSpentAmount() { return spentAmount; }
public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

public BigDecimal getRemainingAmount() { return remainingAmount; }
public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

public BudgetCategory getBudgetCategory() { return budgetCategory; }
public void setBudgetCategory(BudgetCategory budgetCategory) { this.budgetCategory = budgetCategory; }

public Long getApprovedBy() { return approvedBy; }
public void setApprovedBy(Long approvedBy) { this.approvedBy = approvedBy; }

public LocalDate getApprovalDate() { return approvalDate; }
public void setApprovalDate(LocalDate approvalDate) { this.approvalDate = approvalDate; }

public LocalDateTime getCreatedDate() { return createdDate; }
public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

public LocalDateTime getLastUpdated() { return lastUpdated; }
public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

public String getNotes() { return notes; }
public void setNotes(String notes) { this.notes = notes; }
}

enum BudgetCategory {
EVENTS,
EQUIPMENT,
TRAVEL,
MATERIALS,
FUNDRAISING,
OTHER
}
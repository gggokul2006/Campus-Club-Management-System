package com.examly.springapp.service;

import org.springframework.stereotype.Service;
import com.examly.springapp.model.Budget;
import com.examly.springapp.repository.BudgetRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository repository;

    public BudgetService(BudgetRepository repository) {
        this.repository = repository;
    }

    public List<Budget> getAllBudgets() {
        return repository.findAll();
    }

    public Optional<Budget> getBudgetById(Long id) {
        return repository.findById(id);
    }

    public List<Budget> getBudgetsByClub(Long clubId) {
        return repository.findByClubId(clubId);
    }

    public Budget createBudget(Budget budget) {
        budget.calculateRemaining();
        return repository.save(budget);
    }

    public Budget updateBudget(Long id, Budget details) {
        Budget budget = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found with id " + id));

        if (details.getClubId() != null) budget.setClubId(details.getClubId());
        if (details.getFiscalYear() != null) budget.setFiscalYear(details.getFiscalYear());
        if (details.getAllocatedAmount() != null) budget.setAllocatedAmount(details.getAllocatedAmount());
        if (details.getSpentAmount() != null) budget.setSpentAmount(details.getSpentAmount());
        if (details.getBudgetCategory() != null) budget.setBudgetCategory(details.getBudgetCategory());
        if (details.getApprovedBy() != null) budget.setApprovedBy(details.getApprovedBy());
        if (details.getApprovalDate() != null) budget.setApprovalDate(details.getApprovalDate());
        if (details.getNotes() != null) budget.setNotes(details.getNotes());

        budget.calculateRemaining();
        return repository.save(budget);
    }

    public void deleteBudget(Long id) {
        repository.deleteById(id);
    }
}

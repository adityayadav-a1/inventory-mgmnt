package com.inventory.app.repository;

import com.inventory.app.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

    @Transactional
    void deleteByProductId(int productId);

    List<Purchase> findByUserId(int userId);
}
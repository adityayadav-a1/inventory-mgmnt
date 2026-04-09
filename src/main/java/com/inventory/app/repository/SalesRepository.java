package com.inventory.app.repository;

import com.inventory.app.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface SalesRepository extends JpaRepository<Sales, Integer> {

    @Transactional
    void deleteByProductId(int productId);

    List<Sales> findByUserId(int userId);
}
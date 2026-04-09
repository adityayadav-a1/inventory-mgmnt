package com.inventory.app.repository;
import com.inventory.app.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByIsActiveTrue();
    List<Product> findBySupplierId(int supplierId);
    boolean existsByNameAndSupplierId(String name, int supplierId);
    List<Product> findByUserId(int userId);
}
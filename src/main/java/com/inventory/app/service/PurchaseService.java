package com.inventory.app.service;

import com.inventory.app.exception.ResourceNotFoundException;
import com.inventory.app.model.Product;
import com.inventory.app.model.Purchase;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepo;

    @Autowired
    private ProductRepository productRepo;

    public Purchase makePurchase(Purchase purchase) {

        Product product = productRepo.findById(purchase.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + purchase.getProductId()));

        if (product.getUserId() != purchase.getUserId()) {
            throw new RuntimeException("Cannot purchase product belonging to another user");
        }

        product.setQuantity(product.getQuantity() + purchase.getQuantity());
        productRepo.save(product);

        return purchaseRepo.save(purchase);
    }

    public List<Purchase> getAllPurchases() {
        return purchaseRepo.findAll();
    }

    public List<Purchase> getPurchasesByUser(int userId) {
        return purchaseRepo.findByUserId(userId);
    }
}
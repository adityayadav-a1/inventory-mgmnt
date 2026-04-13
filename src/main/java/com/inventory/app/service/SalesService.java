package com.inventory.app.service;

import com.inventory.app.exception.ResourceNotFoundException;
import com.inventory.app.model.Product;
import com.inventory.app.model.Sales;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.repository.SalesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesService {

    @Autowired
    private SalesRepository salesRepo;

    @Autowired
    private ProductRepository productRepo;

    public Sales makeSale(Sales sale) {

        Product product = productRepo.findById(sale.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + sale.getProductId()));

        if (product.getUserId() != sale.getUserId()) {
            throw new RuntimeException("Cannot sell product belonging to another user");
        }

        if (product.getQuantity() < sale.getQuantity()) {
            throw new RuntimeException("Not enough stock available. Current stock: " + product.getQuantity());
        }

        product.setQuantity(product.getQuantity() - sale.getQuantity());
        productRepo.save(product);

        return salesRepo.save(sale);
    }

    public List<Sales> getAllSales() {
        return salesRepo.findAll();
    }

    public List<Sales> getSalesByUser(int userId) {
        return salesRepo.findByUserId(userId);
    }
}
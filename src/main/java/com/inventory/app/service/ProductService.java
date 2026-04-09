package com.inventory.app.service;

import com.inventory.app.exception.ResourceNotFoundException;
import com.inventory.app.model.Product;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.repository.PurchaseRepository;
import com.inventory.app.repository.SalesRepository;
import com.inventory.app.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    @Autowired
    private SupplierRepository supplierRepo;

    @Autowired
    private SalesRepository salesRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    public Product addProduct(Product product) {

        if (!supplierRepo.existsById(product.getSupplierId())) {
            throw new RuntimeException("Supplier ID does not exist");
        }

        if (repo.existsByNameAndSupplierId(product.getName(), product.getSupplierId())) {
            throw new RuntimeException("Product with same name and supplier already exists");
        }

        return repo.save(product);
    }

    public List<Product> getAllProducts() {
        return repo.findByIsActiveTrue();
    }

    @Transactional
    public void deleteProduct(int id) {

        Product product = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Delete from child tables first
        salesRepository.deleteByProductId(id);
        purchaseRepository.deleteByProductId(id);

        // Then delete product
        repo.deleteById(id);
    }

    public Product updateProduct(int id, Product updated) {
        Product p = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (repo.existsByNameAndSupplierId(updated.getName(), updated.getSupplierId())
                && !p.getName().equals(updated.getName())) {
            throw new RuntimeException("Duplicate product");
        }

        p.setName(updated.getName());
        p.setPrice(updated.getPrice());
        p.setQuantity(updated.getQuantity());
        p.setSupplierId(updated.getSupplierId());

        return repo.save(p);
    }

    public List<Product> getLowStockProducts() {
        return repo.findAll().stream()
                .filter(p -> p.getQuantity() < 5)
                .toList();
    }

    public List<Product> getProductsByUser(int userId) {
        return repo.findByUserId(userId);
    }
}
package com.inventory.app.service;

import com.inventory.app.exception.ResourceNotFoundException;
import com.inventory.app.model.Product;
import com.inventory.app.model.Supplier;
import com.inventory.app.repository.ProductRepository;
import com.inventory.app.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ProductRepository productRepository;

    public Supplier addSupplier(Supplier supplier) {
        if (supplierRepository.findByContact(supplier.getContact()) != null) {
            throw new RuntimeException("Contact number is already registered to another supplier");
        }
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getSuppliersByUser(int userId) {
        return supplierRepository.findByUserId(userId);
    }

    public void deleteSupplier(int id, int userId) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        if (supplier.getUserId() != userId) {
            throw new RuntimeException("Cannot delete supplier belonging to another user");
        }

        if (!productRepository.findBySupplierId(id).isEmpty()) {
            throw new RuntimeException("Cannot delete supplier: Products are linked to it");
        }
        supplierRepository.deleteById(id);
    }

    public Supplier updateSupplier(int id, Supplier updatedSupplier) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));

        if (supplier.getUserId() != updatedSupplier.getUserId()) {
            throw new RuntimeException("Cannot update supplier belonging to another user");
        }

        Supplier existingByContact = supplierRepository.findByContact(updatedSupplier.getContact());
        if (existingByContact != null && !existingByContact.getId().equals(id)) {
            throw new RuntimeException("Contact number is already registered to another supplier");
        }

        supplier.setName(updatedSupplier.getName());
        supplier.setContact(updatedSupplier.getContact());
        supplier.setAddress(updatedSupplier.getAddress());

        return supplierRepository.save(supplier);
    }

    public List<Product> getProductsByUser(int userId) {
        return productRepository.findByUserId(userId);
    }
}
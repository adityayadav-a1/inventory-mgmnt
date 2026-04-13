package com.inventory.app.controller;

import com.inventory.app.model.Supplier;
import com.inventory.app.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
@CrossOrigin
public class SupplierController {

    @Autowired
    private SupplierService service;

    @PostMapping
    public Supplier addSupplier(@Valid @RequestBody Supplier supplier) {
        return service.addSupplier(supplier);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable int id, @RequestParam int userId) {
        service.deleteSupplier(id, userId);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable int id, @Valid @RequestBody Supplier supplier) {
        return service.updateSupplier(id, supplier);
    }

    @GetMapping("/user/{userId}")
    public List<Supplier> getByUser(@PathVariable int userId) {
        return service.getSuppliersByUser(userId);
    }
}
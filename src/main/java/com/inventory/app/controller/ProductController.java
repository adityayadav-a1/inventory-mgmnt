package com.inventory.app.controller;

import com.inventory.app.model.Product;
import com.inventory.app.service.ProductService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService service;

    @PostMapping
    public Product add(@Valid @RequestBody Product p) {
        return service.addProduct(p);
    }

    @GetMapping
    public List<Product> getAll() {
        return service.getAllProducts();
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable int id, @Valid @RequestBody Product p) {
        return service.updateProduct(id, p);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        service.deleteProduct(id);
        return "Product deleted successfully";
    }

    @GetMapping("/user/{userId}")
    public List<Product> getByUser(@PathVariable int userId) {
        return service.getProductsByUser(userId);
    }
}
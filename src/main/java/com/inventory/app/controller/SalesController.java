package com.inventory.app.controller;

import com.inventory.app.model.Sales;
import com.inventory.app.service.SalesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@CrossOrigin
public class SalesController {

    @Autowired
    private SalesService service;

    @PostMapping
    public Sales makeSale(@Valid @RequestBody Sales sale) {
        return service.makeSale(sale);
    }

    @GetMapping("/user/{userId}")
    public List<Sales> getByUser(@PathVariable int userId) {
        return service.getSalesByUser(userId);
    }
}
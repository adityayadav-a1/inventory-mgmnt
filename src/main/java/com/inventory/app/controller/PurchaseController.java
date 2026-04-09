package com.inventory.app.controller;

import com.inventory.app.model.Purchase;
import com.inventory.app.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchase")
@CrossOrigin
public class PurchaseController {

    @Autowired
    private PurchaseService service;

    @PostMapping
    public Purchase makePurchase(@Valid @RequestBody Purchase purchase) {
        return service.makePurchase(purchase);
    }

    @GetMapping("/user/{userId}")
    public List<Purchase> getByUser(@PathVariable int userId) {
        return service.getPurchasesByUser(userId);
    }
}
package com.inventory.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Product name is required")
    private String name;

    @Min(value = 0, message = "Price must be non-negative")
    private double price;

    @Min(value = 0, message = "Quantity must be non-negative")
    private int quantity;

    private int supplierId;

    private int userId;

    @Column(columnDefinition = "boolean default true")
    private Boolean isActive = true;
}
package com.inventory.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sales {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int productId;

    @Min(value = 1, message = "Sale quantity must be at least 1")
    private int quantity;

    private LocalDateTime saleDate = LocalDateTime.now();

    private int userId;
}
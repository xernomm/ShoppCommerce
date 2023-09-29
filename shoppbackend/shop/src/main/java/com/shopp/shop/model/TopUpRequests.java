package com.shopp.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.function.BiFunction;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopUpRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long topUpId;

    private double balance;
    private String description;
    private String paymentMethod;
    private LocalDate date;
    private boolean isPaid;

    @ManyToOne
    @JoinColumn(name = "buyer")
    private Buyer buyer;
}

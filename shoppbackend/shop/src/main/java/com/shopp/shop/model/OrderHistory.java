package com.shopp.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"buyer", "orderItems"})
public class OrderHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderHistoryId;

    private LocalDateTime orderDate;
    private double totalPrice;
    private double totalDelivery;
    private double totalCost;
    private String paymentMethod;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    @OneToMany(mappedBy = "orderHistory")
    private List<OrderItem> orderItems = new ArrayList<>();
}

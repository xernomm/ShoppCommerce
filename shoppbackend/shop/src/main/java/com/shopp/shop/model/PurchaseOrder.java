package com.shopp.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"buyer", "orderItems"})
public class PurchaseOrder  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;
    private String orderMail;
    private String orderMaker;
    private LocalDateTime orderDate;

    private String paymentMethod;
    private double orderDistance;
    private double totalPrice;
    private double totalDelivery;
    private double totalCost;
    private double totalShoppPay;
    private double tax;
    private double serviceFee;
    private boolean isPayed;
    private boolean isApproved;

    @Enumerated(EnumType.STRING)
    private Discount discount;



    @ManyToOne
    @JoinColumn(name = "buyerId")
    private Buyer buyer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

}

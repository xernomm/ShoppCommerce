package com.shopp.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Buyer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long buyerId;

    private String name;
    private Double latitude;
    private Double longitude;
    private String road;
    private String village;
    private String subdistrict;
    private String city;
    private String state;
    private String country;
    private String postcode;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private User userId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cartId")
    private Cart cart;

    @JsonIgnore
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<PurchaseOrder> orders = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<OrderHistory> orderHistory = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<OrderStatus> orderStatus = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<Vouchers> vouchers = new ArrayList<>();

    @JsonIgnore
    @OneToOne(mappedBy = "buyer")
    private ShoppPay shoppPay;

    @JsonIgnore
    @OneToMany(mappedBy = "buyer", cascade = CascadeType.ALL)
    private List<TopUpRequests> topUpRequests = new ArrayList<>();


    @Override
    public int hashCode() {
        return Objects.hash(buyerId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Buyer buyer = (Buyer) o;
        return Objects.equals(buyerId, buyer.buyerId);
    }
}

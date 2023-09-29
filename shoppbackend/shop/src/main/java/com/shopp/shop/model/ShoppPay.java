package com.shopp.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppPay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shoppPayId;

    private double balance;
    private String email;
    private String phoneNumber;
    private String name;
    private String city;
    private String state;
    private String country;
    private String postcode;
    private String password;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer")
    private Buyer buyer;
}

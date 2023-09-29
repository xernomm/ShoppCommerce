package com.shopp.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.processing.SupportedOptions;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierPay {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierPayId;

    private double balance;
    private String email;
    private String phoneNumber;
    private String name;
    private String city;
    private String state;
    private String country;
    private String postcode;
    private String password;

    @OneToOne
    private ShoppProfit shoppProfit;



    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier")
    private Supplier supplier;

}

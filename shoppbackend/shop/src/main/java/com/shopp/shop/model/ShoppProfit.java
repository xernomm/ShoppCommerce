package com.shopp.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppProfit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shoppProfitId;
    private double balance;
}

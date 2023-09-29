package com.shopp.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vouchers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long voucherId;

    private int quantity;
    private String voucherName;
    private boolean isActivated;

    @Enumerated(EnumType.STRING)
    private Discount discount;

    @ManyToOne
    @JoinColumn(name = "buyer")
    private Buyer buyer;

}

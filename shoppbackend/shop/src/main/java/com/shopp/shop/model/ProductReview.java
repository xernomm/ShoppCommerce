package com.shopp.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productReviewId;

    private int rating;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Lob
    @Column(nullable = true)
    private byte[] reviewImage;


    @ManyToOne
    @JoinColumn(name = "product")
    private Product product;
}

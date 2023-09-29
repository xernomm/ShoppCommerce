package com.shopp.shop.repository;

import com.shopp.shop.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    Optional<ProductReview> findByEmail(String email);
}

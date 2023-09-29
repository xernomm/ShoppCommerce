package com.shopp.shop.repository;

import com.shopp.shop.model.ShoppPay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShoppPayRepository extends JpaRepository<ShoppPay, Long> {

    Optional<ShoppPay> findByEmail(String email);

}

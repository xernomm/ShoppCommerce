package com.shopp.shop.repository;

import com.shopp.shop.model.Vouchers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherRepository extends JpaRepository<Vouchers, Long> {
}

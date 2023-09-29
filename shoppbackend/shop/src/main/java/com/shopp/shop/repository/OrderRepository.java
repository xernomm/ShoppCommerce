package com.shopp.shop.repository;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {
    List<PurchaseOrder> findAllByBuyer(Buyer buyer);
}

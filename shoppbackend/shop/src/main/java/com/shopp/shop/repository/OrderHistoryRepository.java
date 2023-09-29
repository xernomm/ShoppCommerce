package com.shopp.shop.repository;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.model.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long> {
    List<OrderHistory> findAllByBuyer(Buyer buyer);
}

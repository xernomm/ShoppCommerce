package com.shopp.shop.repository;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.model.OrderStatus;
import com.shopp.shop.model.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {

    List<OrderStatus> findAllByBuyer(Buyer buyer);

}

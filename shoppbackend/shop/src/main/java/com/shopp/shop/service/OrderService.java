package com.shopp.shop.service;


import com.shopp.shop.model.Buyer;
import com.shopp.shop.model.PurchaseOrder;
import com.shopp.shop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public PurchaseOrder newOrder(PurchaseOrder order){
        return orderRepository.save(order);
    }

    public List<PurchaseOrder> allOrders(){
        return orderRepository.findAll();
    }

    public void deleteOrderByBuyerId(Long buyerId){
        Buyer buyer = new Buyer();
        buyer.setBuyerId(buyerId);

        List<PurchaseOrder> orderList = orderRepository.findAllByBuyer(buyer);
        orderRepository.deleteAll(orderList);
    }
}

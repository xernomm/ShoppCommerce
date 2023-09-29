package com.shopp.shop.service;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.model.OrderHistory;
import com.shopp.shop.repository.OrderHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderHistoryService {
    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    public OrderHistory newOrderHistory(OrderHistory orderHistory){
        return orderHistoryRepository.save(orderHistory);
    }

    public void deleteAnOrder(Long orderHistoryId){
        Optional<OrderHistory> idHistory = orderHistoryRepository.findById(orderHistoryId);
        if (idHistory.isEmpty()){
            throw new IllegalArgumentException("not found");
        }
        orderHistoryRepository.delete(idHistory.get());
    }

    public void deleteAllHistory(Long buyerId){
        Buyer buyer = new Buyer();
        buyer.setBuyerId(buyerId);

        List<OrderHistory> historyList = orderHistoryRepository.findAllByBuyer(buyer);
        orderHistoryRepository.deleteAll(historyList);
    }
}

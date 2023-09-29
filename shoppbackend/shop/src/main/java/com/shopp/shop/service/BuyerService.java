package com.shopp.shop.service;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.repository.BuyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class BuyerService {
    @Autowired
    private BuyerRepository buyerRepository;

    public Buyer saveBuyer(Buyer buyer){
        return buyerRepository.save(buyer);
    }
}

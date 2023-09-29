package com.shopp.shop.service;


import com.shopp.shop.model.SupplierPay;
import com.shopp.shop.repository.SupplierPayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class SupplierPayService {

    @Autowired
    private SupplierPayRepository supplierPayRepository;

    public SupplierPay newAccount(SupplierPay supplierPay){
        return supplierPayRepository.save(supplierPay);
    }

}

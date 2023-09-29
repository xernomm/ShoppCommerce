package com.shopp.shop.service;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

//    public Buyer newVoucher
}

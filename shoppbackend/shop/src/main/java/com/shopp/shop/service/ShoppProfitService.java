package com.shopp.shop.service;

import com.shopp.shop.model.ShoppProfit;
import com.shopp.shop.repository.ShoppProfitRepository;
import com.shopp.shop.repository.SupplierPayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class ShoppProfitService {

    @Autowired
    private ShoppProfitRepository shoppProfitRepository;

    @Autowired
    private SupplierPayRepository supplierPayRepository;

    public double calculateAndUpdateMasterProfit() {
        double totalSupplierIncomes = supplierPayRepository.calculateTotalSupplierIncomes(); // Assuming you have a custom query for this

        double masterProfitValue = 0.75 * totalSupplierIncomes;

        ShoppProfit masterProfit = shoppProfitRepository.findById(1L).orElse(new ShoppProfit()); // Assuming there's a single MasterProfit entity with ID 1
        masterProfit.setBalance(masterProfitValue);
        shoppProfitRepository.save(masterProfit);
        return masterProfitValue;
    }
}

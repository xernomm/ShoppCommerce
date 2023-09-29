package com.shopp.shop.service;

import com.shopp.shop.model.Supplier;
import com.shopp.shop.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.PushBuilder;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public Supplier saveSupplier(Supplier supplier){
        return supplierRepository.save(supplier);
    }

    public List<Supplier>allStores(){
        return supplierRepository.findAll();
    }

    public Supplier saveImage(Supplier supplier, MultipartFile imageFile) throws IOException{
        if (imageFile != null && !imageFile.isEmpty()){
            supplier.setCompanyImage(imageFile.getBytes());
        }
        return supplierRepository.save(supplier);
    }
}

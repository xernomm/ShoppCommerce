package com.shopp.shop.service;

import com.shopp.shop.model.OrderItem;
import com.shopp.shop.model.Product;
import com.shopp.shop.repository.OrderItemRepository;
import com.shopp.shop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Product addProduct(Product product, MultipartFile productImage) throws IOException{
        if(productImage!=null && !productImage.isEmpty()){
            product.setProductImage(productImage.getBytes());
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Long productId){
        Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()){
            throw new IllegalArgumentException("product not found");
        }
        productRepository.delete(product.get());
    }

    public Product getProductByOrderItemId(Long orderItemId) {
        Optional<OrderItem> orderItemOptional = orderItemRepository.findById(orderItemId);

        if (orderItemOptional.isPresent()) {
            OrderItem orderItem = orderItemOptional.get();
            return orderItem.getProduct();
        } else {
            // Handle the case where the OrderItem with the specified ID is not found
            return null;
        }
    }
    public List<Product> allProducts(){
        return productRepository.findAll();
    }
}

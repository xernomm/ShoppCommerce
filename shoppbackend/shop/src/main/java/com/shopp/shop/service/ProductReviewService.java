package com.shopp.shop.service;

import com.shopp.shop.model.ProductReview;
import com.shopp.shop.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Optional;

@Service
@Transactional
public class ProductReviewService {
    @Autowired
    private ProductReviewRepository productReviewRepository;

    public ProductReview newReview(ProductReview productReview, MultipartFile reviewImage) throws IOException {
        if (!reviewImage.isEmpty() && reviewImage != null){
            productReview.setReviewImage(reviewImage.getBytes());
        }
        if (reviewImage.isEmpty() && reviewImage == null){
            productReview.setReviewImage(null);
            productReviewRepository.save(productReview);
        }
        return productReviewRepository.save(productReview);
    }

    public void deleteReview(Long reviewId){
        Optional<ProductReview> idReview = productReviewRepository.findById(reviewId);
        if (idReview.isEmpty()){
            throw new IllegalArgumentException("review not found");
        }
        productReviewRepository.delete(idReview.get());
    }



}

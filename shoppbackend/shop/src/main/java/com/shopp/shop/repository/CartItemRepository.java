package com.shopp.shop.repository;

import com.shopp.shop.model.Cart;
import com.shopp.shop.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findAllByCart(Cart cart);
}

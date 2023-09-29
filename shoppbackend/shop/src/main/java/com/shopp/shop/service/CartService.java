package com.shopp.shop.service;

import com.shopp.shop.model.Cart;
import com.shopp.shop.model.CartItem;
import com.shopp.shop.repository.CartItemRepository;
import com.shopp.shop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    public Cart addCart(Cart cart){
        return cartRepository.save(cart);
    }

    public List<Cart> allCarts(){
        return cartRepository.findAll();
    }

    public List<CartItem> getAllCartItemsForCart(Long cartId) {
        // Retrieve the Cart based on cartId
        Cart cart = new Cart();
        cart.setCartId(cartId); // Set the cartId for the Cart you want to retrieve
        return cartItemRepository.findAllByCart(cart);
    }

    public void deleteAllCartItemsForCart(Long cartId) {
        Cart cart = new Cart();
        cart.setCartId(cartId);

        List<CartItem> cartItems = cartItemRepository.findAllByCart(cart);
        cartItemRepository.deleteAll(cartItems);
    }
}

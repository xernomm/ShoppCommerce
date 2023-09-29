package com.shopp.shop.response;

import com.shopp.shop.model.Buyer;
import com.shopp.shop.model.Role;
import com.shopp.shop.model.Supplier;
import com.shopp.shop.model.UserDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SuccessLoginResponse {
    private String token;
    private String email;
    private Role role;
    private UserDetails userDetails;
    private LocalDate joinedDate;
    private Buyer buyer;
    private Supplier supplier;
    private boolean isActive;
}
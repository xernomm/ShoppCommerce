package com.shopp.shop.requestBody;

import com.shopp.shop.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestBody {
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;
    private int age;
    private Double latitude;
    private Double longitude;
    private String road;
    private String village;
    private String subdistrict;
    private String city;
    private String state;
    private String country;
    private String postcode;
}

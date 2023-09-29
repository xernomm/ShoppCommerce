package com.shopp.shop.requestBody;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditProfileBuyerRequestBody {
    private MultipartFile profilePicture;
    private String name;
    private String phoneNumber;
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

package com.shopp.shop.requestBody;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminEditUserRequestBody {

    private String name;
    private int age;
    private String phoneNumber;
}

package com.shopp.shop.requestBody;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewProductRequestBody {
    private String productName;
    private MultipartFile productImage;
    private String productDescription;
    private String productType;
    private int stock;
    private int price;
}

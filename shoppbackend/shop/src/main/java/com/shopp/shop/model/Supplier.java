package com.shopp.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;
    private String name;
    private String companyName;
    private String companyNumber;
    private String companyEmail;
    private Double latitude;
    private Double longitude;
    private String road;
    private String village;
    private String subdistrict;
    private String city;
    private String state;
    private String country;
    private String postcode;

    @Lob
    private byte[] companyImage;

    @JsonIgnore
    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    private List<Product> products;

    @JsonIgnore
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "userId")
    private User userId;

    @JsonIgnore
    @OneToOne(mappedBy = "supplier")
    private SupplierPay supplierPay;



    @Override
    public int hashCode() {
        return Objects.hash(supplierId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supplier supplier = (Supplier) o;
        return Objects.equals(supplierId, supplier.supplierId);
    }
}

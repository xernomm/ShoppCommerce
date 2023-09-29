package com.shopp.shop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String email;
    private String password;
    private LocalDate joinedDate;

    @Lob
    private byte[] profilePicture;

    @Enumerated(EnumType.STRING) // Use EnumType.STRING to store role as a string in the database
    private Role role;

    private boolean isActive;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userId")
    private UserDetails userDetails;

    @JsonIgnore
    @OneToOne(mappedBy = "userId")
    private Buyer buyer;

    @JsonIgnore
    @OneToOne(mappedBy = "userId")
    private Supplier supplier;



    @Override
    public int hashCode() {
        return Objects.hash(userId); // Use a unique identifier for hashing
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(userId, user.userId); // Use a unique identifier for equality check
    }
}

package com.app.ecom.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;


//@Entity(name = "user_table") Giving name to the table
//@AllArgsConstructor // public User(Long id, String firstName, String lastName){}
@Data
@Entity(name = "user_table")
@NoArgsConstructor // public User(){}
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role = UserRole.CUSTOMER;


    // Joining these two Entities(Tables)
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true) //Prevent any sort of orphan records
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @CreationTimestamp
    private LocalDateTime createdAt;//Created only once when the entity is created
    @UpdateTimestamp
    private LocalDateTime updatedAt;//Regenerated every time when the entity is updated

}

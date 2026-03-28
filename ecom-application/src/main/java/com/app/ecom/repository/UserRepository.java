package com.app.ecom.repository;

import com.app.ecom.dto.CartItemRequest;
import com.app.ecom.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    //Leave it alone
}

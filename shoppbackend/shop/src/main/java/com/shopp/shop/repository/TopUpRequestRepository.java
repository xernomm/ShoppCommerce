package com.shopp.shop.repository;

import com.shopp.shop.model.TopUpRequests;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopUpRequestRepository extends JpaRepository<TopUpRequests, Long> {
}

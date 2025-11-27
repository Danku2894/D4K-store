package com.d4k.ecommerce.modules.user.repository;

import com.d4k.ecommerce.modules.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Address Repository
 * Data access layer cho Address entity
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    
    /**
     * Tìm tất cả addresses của user
     */
    List<Address> findByUserId(Long userId);
    
    /**
     * Tìm default address của user
     */
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);
    
    /**
     * Tìm address của user theo ID
     */
    Optional<Address> findByIdAndUserId(Long id, Long userId);
}


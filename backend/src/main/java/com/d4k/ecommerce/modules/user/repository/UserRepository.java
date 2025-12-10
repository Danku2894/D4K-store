package com.d4k.ecommerce.modules.user.repository;

import com.d4k.ecommerce.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * User Repository
 * Data access layer cho User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Tìm user theo email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Kiểm tra email đã tồn tại chưa
     */
    Boolean existsByEmail(String email);
    
    /**
     * Tìm kiếm users theo keyword trong email hoặc fullName
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<User> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    /**
     * Đếm số users active
     */
    Long countByIsActiveTrue();
    
    /**
     * Đếm số users mới từ một thời điểm
     */
    Long countByCreatedAtAfter(LocalDateTime dateTime);
    /**
     * Tìm user theo token reset password
     */
    Optional<User> findByResetPasswordToken(String token);
}


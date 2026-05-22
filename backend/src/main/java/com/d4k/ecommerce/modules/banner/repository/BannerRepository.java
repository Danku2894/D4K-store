package com.d4k.ecommerce.modules.banner.repository;

import com.d4k.ecommerce.modules.banner.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    Optional<Banner> findTopByIsActiveTrueOrderByCreatedAtDesc();
}

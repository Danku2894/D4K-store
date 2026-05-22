package com.d4k.ecommerce.modules.banner.service.impl;

import com.d4k.ecommerce.modules.banner.dto.BannerRequest;
import com.d4k.ecommerce.modules.banner.dto.BannerResponse;
import com.d4k.ecommerce.modules.banner.entity.Banner;
import com.d4k.ecommerce.modules.banner.repository.BannerRepository;
import com.d4k.ecommerce.modules.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    @Override
    @Transactional
    public BannerResponse updateBanner(BannerRequest request) {
        log.info("Updating active banner to: {}", request.getImageUrl());
        
        // Deactivate old banners
        bannerRepository.findAll().forEach(b -> {
            b.setIsActive(false);
            bannerRepository.save(b);
        });

        // Create new active banner
        Banner newBanner = Banner.builder()
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .build();
        
        Banner savedBanner = bannerRepository.save(newBanner);
        
        return BannerResponse.builder()
                .id(savedBanner.getId())
                .imageUrl(savedBanner.getImageUrl())
                .isActive(savedBanner.getIsActive())
                .createdAt(savedBanner.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public BannerResponse getActiveBanner() {
        return bannerRepository.findTopByIsActiveTrueOrderByCreatedAtDesc()
                .map(b -> BannerResponse.builder()
                        .id(b.getId())
                        .imageUrl(b.getImageUrl())
                        .isActive(b.getIsActive())
                        .createdAt(b.getCreatedAt())
                        .build())
                .orElse(null); // Return null or default if none exist
    }
}

package com.d4k.ecommerce.modules.banner.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.banner.dto.BannerRequest;
import com.d4k.ecommerce.modules.banner.dto.BannerResponse;
import com.d4k.ecommerce.modules.banner.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<BannerResponse>> getActiveBanner() {
        BannerResponse banner = bannerService.getActiveBanner();
        return ResponseEntity.ok(ApiResponse.success(banner, "Active banner retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BannerResponse>> updateBanner(@Valid @RequestBody BannerRequest request) {
        log.info("REST request to update banner");
        BannerResponse banner = bannerService.updateBanner(request);
        return ResponseEntity.ok(ApiResponse.success(banner, "Banner updated successfully"));
    }
}

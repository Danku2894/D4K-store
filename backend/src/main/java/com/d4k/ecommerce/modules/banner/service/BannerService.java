package com.d4k.ecommerce.modules.banner.service;

import com.d4k.ecommerce.modules.banner.dto.BannerRequest;
import com.d4k.ecommerce.modules.banner.dto.BannerResponse;

public interface BannerService {
    BannerResponse updateBanner(BannerRequest request);
    BannerResponse getActiveBanner();
}

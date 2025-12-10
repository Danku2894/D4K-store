package com.d4k.ecommerce.common.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Configuration
@Getter
public class VnPayConfig {
    @Value("${vnpay.url}")
    private String vnp_PayUrl;
    
    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;
    
    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;
    
    @Value("${vnpay.hash-secret}")
    private String secretKey;
    
    @Value("${vnpay.version:2.1.0}")
    private String vnp_Version;
    
    @Value("${vnpay.command:pay}")
    private String vnp_Command;
    
    @Value("${vnpay.order-type:other}")
    private String orderType;

    public Map<String, String> getVNPayConfig() {
        Map<String, String> vnpParamsMap = new HashMap<>();
        vnpParamsMap.put("vnp_Version", this.vnp_Version);
        vnpParamsMap.put("vnp_Command", this.vnp_Command);
        vnpParamsMap.put("vnp_TmnCode", this.vnp_TmnCode);
        vnpParamsMap.put("vnp_CurrCode", "VND");
        vnpParamsMap.put("vnp_Locale", "vn");
        vnpParamsMap.put("vnp_OrderType", this.orderType);
        vnpParamsMap.put("vnp_ReturnUrl", this.vnp_ReturnUrl); // Use configured return URL
        
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnpParamsMap.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnpParamsMap.put("vnp_ExpireDate", vnp_ExpireDate);
        
        return vnpParamsMap;
    }
}

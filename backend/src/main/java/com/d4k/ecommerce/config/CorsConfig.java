package com.d4k.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration
 * Cho phép Frontend (React) gọi API từ domain khác
 */
@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Cho phép credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Cho phép các origin (frontend URLs)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",  // Vite dev server
                "http://localhost:3000"   // Alternative port
        ));
        
        // Cho phép các headers
        config.setAllowedHeaders(Arrays.asList(
                "Origin",
                "Content-Type",
                "Accept",
                "Authorization",
                "X-Requested-With"
        ));
        
        // Cho phép các HTTP methods
        config.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));
        
        // Expose headers
        config.setExposedHeaders(List.of("Authorization"));
        
        // Max age
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/api/**", config);
        
        return new CorsFilter(source);
    }
}


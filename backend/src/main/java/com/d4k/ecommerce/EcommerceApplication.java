package com.d4k.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for E-commerce Fashion Store
 * Author: D4K Team
 * Description: Spring Boot application entry point
 */
@SpringBootApplication
@EnableJpaAuditing
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }
}


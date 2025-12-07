package com.d4k.ecommerce.common.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseFixer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixSequences() {
        log.info("Starting database sequence fix...");
        try {
            // Fix product_variants sequence
            resetSequence("product_variants", "product_variants_id_seq");
            
            // Fix products sequence
            resetSequence("products", "products_id_seq");
            
            // Fix categories sequence
            resetSequence("categories", "categories_id_seq");
            
            // Fix product_images sequence
            resetSequence("product_images", "product_images_id_seq");
            
            log.info("Database sequences fixed successfully.");
        } catch (Exception e) {
            log.error("Failed to fix database sequences: {}", e.getMessage());
        }
    }

    private void resetSequence(String tableName, String sequenceName) {
        try {
            String sql = String.format("SELECT setval('%s', COALESCE((SELECT MAX(id) FROM %s), 1))", sequenceName, tableName);
            jdbcTemplate.execute(sql);
            log.info("Reset sequence {} for table {}", sequenceName, tableName);
        } catch (Exception e) {
            log.warn("Could not reset sequence {} for table {}: {}", sequenceName, tableName, e.getMessage());
        }
    }
}

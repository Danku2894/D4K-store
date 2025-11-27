package com.d4k.ecommerce.common.constants;

/**
 * Application Constants
 */
public class AppConstants {
    
    // JWT
    public static final String JWT_SECRET_KEY = "jwt.secret";
    public static final String JWT_EXPIRATION = "jwt.expiration";
    public static final String JWT_TOKEN_PREFIX = "Bearer ";
    public static final String JWT_HEADER_STRING = "Authorization";
    
    // Default values
    public static final int DEFAULT_PAGE_SIZE = 10;
    public static final int MAX_PAGE_SIZE = 100;
    
    private AppConstants() {
        // Private constructor to prevent instantiation
    }
}


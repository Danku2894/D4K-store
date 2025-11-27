package com.d4k.ecommerce.common.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Password Hash Generator Utility
 * Sử dụng để generate BCrypt hash cho passwords
 * 
 * Run main method để generate hash cho admin password
 */
public class PasswordHashGenerator {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        // Generate hash cho admin password
        String adminPassword = "admin123";
        String adminHash = encoder.encode(adminPassword);
        
        System.out.println("=== Password Hash Generator ===");
        System.out.println();
        System.out.println("Plain password: " + adminPassword);
        System.out.println("BCrypt hash: " + adminHash);
        System.out.println();
        System.out.println("Update V2__seed_admin_user.sql với hash này:");
        System.out.println("password = '" + adminHash + "'");
        System.out.println();
        
        // Generate hash cho user password
        String userPassword = "user123";
        String userHash = encoder.encode(userPassword);
        
        System.out.println("Plain password: " + userPassword);
        System.out.println("BCrypt hash: " + userHash);
    }
}


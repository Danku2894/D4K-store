package com.d4k.ecommerce.common.exception;

/**
 * Exception khi xác thực thất bại (401)
 */
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
}


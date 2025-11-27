package com.d4k.ecommerce.common.exception;

import lombok.Getter;

/**
 * Custom exception cho business logic errors
 */
@Getter
public class BusinessException extends RuntimeException {
    
    private final String errorCode;
    
    public BusinessException(String message) {
        super(message);
        this.errorCode = null;
    }
    
    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = null;
    }
}


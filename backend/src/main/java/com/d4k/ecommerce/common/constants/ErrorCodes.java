package com.d4k.ecommerce.common.constants;

/**
 * Error Codes Constants
 */
public class ErrorCodes {
    
    // Authentication & Authorization
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String INVALID_TOKEN = "INVALID_TOKEN";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String UNAUTHORIZED = "UNAUTHORIZED";
    
    // Validation
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String INVALID_INPUT = "INVALID_INPUT";
    
    // Resource
    public static final String RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";
    public static final String USER_NOT_FOUND = "USER_NOT_FOUND";
    
    // Category
    public static final String CATEGORY_NAME_EXISTS = "CATEGORY_NAME_EXISTS";
    public static final String INVALID_PARENT = "INVALID_PARENT";
    public static final String CIRCULAR_REFERENCE = "CIRCULAR_REFERENCE";
    public static final String CATEGORY_HAS_CHILDREN = "CATEGORY_HAS_CHILDREN";
    
    // Product
    public static final String INVALID_STOCK = "INVALID_STOCK";
    public static final String INVALID_PRICE = "INVALID_PRICE";
    public static final String OUT_OF_STOCK = "OUT_OF_STOCK";
    public static final String INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK";
    public static final String PRODUCT_NOT_AVAILABLE = "PRODUCT_NOT_AVAILABLE";
    
    // Wishlist
    public static final String PRODUCT_ALREADY_IN_WISHLIST = "PRODUCT_ALREADY_IN_WISHLIST";
    
    // Review
    public static final String REVIEW_ALREADY_EXISTS = "REVIEW_ALREADY_EXISTS";
    public static final String INVALID_RATING = "INVALID_RATING";
    public static final String PURCHASE_REQUIRED = "PURCHASE_REQUIRED";
    public static final String REVIEW_NOT_FOUND = "REVIEW_NOT_FOUND";
    
    // Coupon
    public static final String COUPON_CODE_EXISTS = "COUPON_CODE_EXISTS";
    public static final String INVALID_COUPON = "INVALID_COUPON";
    public static final String COUPON_EXPIRED = "COUPON_EXPIRED";
    public static final String INVALID_DATE_RANGE = "INVALID_DATE_RANGE";
    public static final String INVALID_DISCOUNT_VALUE = "INVALID_DISCOUNT_VALUE";
    public static final String MIN_ORDER_NOT_MET = "MIN_ORDER_NOT_MET";
    public static final String COUPON_USAGE_LIMIT_REACHED = "COUPON_USAGE_LIMIT_REACHED";
    
    // Order
    public static final String CART_EMPTY = "CART_EMPTY";
    public static final String ORDER_NOT_CANCELLABLE = "ORDER_NOT_CANCELLABLE";
    public static final String INVALID_STATUS_TRANSITION = "INVALID_STATUS_TRANSITION";
    
    // User Profile
    public static final String PASSWORD_MISMATCH = "PASSWORD_MISMATCH";
    public static final String SAME_PASSWORD = "SAME_PASSWORD";
    public static final String INCORRECT_PASSWORD = "INCORRECT_PASSWORD";
    
    // Server
    public static final String INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR";
    
    private ErrorCodes() {
        // Private constructor to prevent instantiation
    }
}


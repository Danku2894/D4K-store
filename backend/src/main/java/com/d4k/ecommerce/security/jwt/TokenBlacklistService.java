package com.d4k.ecommerce.security.jwt;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Instant;
import java.util.Map;

/**
 * Service quản lý Token Blacklist in-memory
 */
@Service
public class TokenBlacklistService {

    // Lưu token và thời gian hết hạn của nó
    private final Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    /**
     * Thêm token vào blacklist
     */
    public void blacklistToken(String token, Instant expiryDate) {
        blacklistedTokens.put(token, expiryDate);
        cleanupExpiredTokens();
    }

    /**
     * Kiểm tra xem token có nằm trong blacklist không
     */
    public boolean isBlacklisted(String token) {
        Instant expiry = blacklistedTokens.get(token);
        if (expiry == null) {
            return false;
        }
        
        // Nếu token đã hết hạn, ta có thể tự động xóa nó khỏi map
        if (Instant.now().isAfter(expiry)) {
            blacklistedTokens.remove(token);
            return false; // Token hết hạn thì tự nó đã không hợp lệ rồi, không cần block kiểu blacklist
        }
        
        return true;
    }

    /**
     * Dọn dẹp các token đã quá hạn khỏi bộ nhớ
     */
    private void cleanupExpiredTokens() {
        Instant now = Instant.now();
        blacklistedTokens.entrySet().removeIf(entry -> now.isAfter(entry.getValue()));
    }
}

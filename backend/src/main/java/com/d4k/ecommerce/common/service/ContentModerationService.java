package com.d4k.ecommerce.common.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Content Moderation Service
 * Kiểm duyệt nội dung (từ ngữ thô tục, spam)
 */
@Service
public class ContentModerationService {

    private static final Set<String> BAD_WORDS = new HashSet<>(Arrays.asList(
            // English
            "fuck", "bitch", "shit", "asshole", "bastard", "dick", "pussy", "cunt",
            "fake", "scam", "spam",
            
            // Vietnamese 
            "dm", "dcm", "vkl", "cc", "loz", "lon", "buoi", "cut", "cho de", "thay ba",
            "đm", "đcm", "vcl", "vãi", "lồn", "buồi", "cứt", "chó đẻ", "cặc"
    ));

    /**
     * Kiểm tra nội dung có chứa từ ngữ không phù hợp không
     * @param content nội dung cần kiểm tra
     * @return true nếu nội dung sạch, false nếu vi phạm
     */
    public boolean isClean(String content) {
        if (content == null || content.trim().isEmpty()) {
            return true;
        }

        String lowerCaseContent = content.toLowerCase();

        for (String badWord : BAD_WORDS) {
            // Check exact word or word surrounded by spaces/boundaries
            // Simple logic: if content contains the bad word
            if (lowerCaseContent.contains(badWord)) {
               return false;
            }
        }
        return true;
    }
}

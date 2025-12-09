package com.d4k.ecommerce.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Primary // Use this as the main FileUploadService if interfaces were used (or just replace the bean)
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            // Check for empty file
            if (file.isEmpty()) {
                throw new RuntimeException("Empty file");
            }

            // Generate a unique filename using UUID
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".") + 1)
                    : "";
            String publicId = UUID.randomUUID().toString();

            // Upload parameters
            Map<String, Object> params = ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", "d4k-store/products", // Organize in folder
                    "resource_type", "auto"
            );

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            
            // Return the secure URL
            String url = (String) uploadResult.get("secure_url");
            log.info("Uploaded to Cloudinary: {}", url);
            return url;

        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            // Extract public ID from URL
            // URL format: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/public_id.jpg
            String publicId = extractPublicIdFromUrl(fileUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                log.info("Deleted from Cloudinary: {}", publicId);
            }
        } catch (IOException e) {
            log.error("Cloudinary delete failed", e);
        }
    }

    private String extractPublicIdFromUrl(String url) {
        try {
            // Simple extraction logic - needs to be robust for production
            // Assuming default cloudinary URL structure
            // Example: .../d4k-store/products/uuid.jpg
            int uploadIndex = url.indexOf("/upload/");
            if (uploadIndex == -1) return null;

            String pathAfterUpload = url.substring(uploadIndex + 8); // Skip "/upload/"
            // Skip version if present (e.g., v1234567890/)
            int slashIndex = pathAfterUpload.indexOf("/");
            if (slashIndex != -1 && pathAfterUpload.substring(0, slashIndex).startsWith("v")) {
                pathAfterUpload = pathAfterUpload.substring(slashIndex + 1);
            }
            
            // Remove extension
            int dotIndex = pathAfterUpload.lastIndexOf(".");
            if (dotIndex != -1) {
                return pathAfterUpload.substring(0, dotIndex);
            }
            return pathAfterUpload;
        } catch (Exception e) {
            log.warn("Could not extract publicId from URL: {}", url);
            return null;
        }
    }
}

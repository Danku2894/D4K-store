package com.d4k.ecommerce.common.service;

import com.d4k.ecommerce.common.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * File Upload Service
 * Handles file uploads for images
 */
@Slf4j
@Service
public class FileUploadService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Upload an image file
     * @param file The multipart file to upload
     * @return The URL path of the uploaded file
     */
    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("File is empty", "INVALID_FILE");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("File size exceeds 10MB limit", "FILE_TOO_LARGE");
        }

        // Validate file type
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new BusinessException("Invalid filename", "INVALID_FILE");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new BusinessException(
                "Invalid file type. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS),
                "INVALID_FILE_TYPE"
            );
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath);
            }

            // Generate unique filename
            String uniqueFilename = UUID.randomUUID().toString() + "." + extension;
            Path filePath = uploadPath.resolve(uniqueFilename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File uploaded successfully: {}", uniqueFilename);

            // Return relative path (can be served by Spring Boot static resource handler)
            return "/uploads/" + uniqueFilename;

        } catch (IOException e) {
            log.error("Failed to upload file", e);
            throw new BusinessException("Failed to upload file: " + e.getMessage(), "UPLOAD_FAILED");
        }
    }

    /**
     * Delete an uploaded file
     * @param fileUrl The URL path of the file to delete
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            // Extract filename from URL (/uploads/filename.jpg -> filename.jpg)
            String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted successfully: {}", filename);
            }
        } catch (IOException e) {
            log.error("Failed to delete file: {}", fileUrl, e);
            // Don't throw exception, just log the error
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }
}

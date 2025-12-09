package com.d4k.ecommerce.common.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.service.CloudinaryService;
// import com.d4k.ecommerce.infrastructure.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
// import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final CloudinaryService cloudinaryService;
    // private final FileStorageService fileStorageService; // Keep for fallback if needed, or remove

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        // Upload to Cloudinary
        String fileUrl = cloudinaryService.uploadImage(file);
        
        Map<String, String> responseData = new HashMap<>();
        responseData.put("filename", file.getOriginalFilename());
        responseData.put("url", fileUrl); // Cloudinary returns full URL
        
        return ResponseEntity.ok(ApiResponse.success(responseData, "File uploaded successfully"));
    }

    // Deprecated or redirect to Cloudinary URL if stored locally
    // Cloudinary URLs are public, so we might not need this anymore for new files
    // But for backward compatibility with existing local files, we might need it.
    // For now, I will comment it out or leave it throwing error if used for new files.
    /*
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        // ...
    }
    */
}

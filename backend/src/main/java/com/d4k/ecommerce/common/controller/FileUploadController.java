package com.d4k.ecommerce.common.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        // Upload to Cloudinary
        String fileUrl = cloudinaryService.uploadImage(file);
        
        Map<String, String> responseData = new HashMap<>();
        responseData.put("filename", file.getOriginalFilename());
        responseData.put("url", fileUrl); // Cloudinary returns full URL
        
        return ResponseEntity.ok(ApiResponse.success(responseData, "File uploaded successfully"));
    }
}

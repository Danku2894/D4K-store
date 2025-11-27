package com.d4k.ecommerce.modules.user.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.common.response.PageResponse;
import com.d4k.ecommerce.modules.user.dto.request.UpdateUserRequest;
import com.d4k.ecommerce.modules.user.dto.response.UserDetailResponse;
import com.d4k.ecommerce.modules.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Admin User Controller
 * REST API endpoints cho quản lý users (chỉ dành cho ADMIN)
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    
    private final UserService userService;
    
    /**
     * Lấy danh sách tất cả users có phân trang
     * GET /api/v1/admin/users?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserDetailResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        log.info("Admin fetching all users - page: {}, size: {}, sortBy: {}", page, size, sortBy);
        
        // Tạo Pageable với sorting
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") 
                ? Sort.Direction.ASC 
                : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        Page<UserDetailResponse> users = userService.getAllUsers(pageable);
        
        PageResponse<UserDetailResponse> pageResponse = PageResponse.from(users);
        
        ApiResponse<PageResponse<UserDetailResponse>> response = ApiResponse.success(
                pageResponse,
                "Users retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Tìm kiếm users theo keyword
     * GET /api/v1/admin/users/search?keyword=john&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<UserDetailResponse>>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        log.info("Admin searching users with keyword: {}", keyword);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<UserDetailResponse> users = userService.searchUsers(keyword, pageable);
        
        PageResponse<UserDetailResponse> pageResponse = PageResponse.from(users);
        
        ApiResponse<PageResponse<UserDetailResponse>> response = ApiResponse.success(
                pageResponse,
                "Users search completed successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy chi tiết user theo ID
     * GET /api/v1/admin/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDetailResponse>> getUserById(@PathVariable Long id) {
        log.info("Admin fetching user with ID: {}", id);
        
        UserDetailResponse user = userService.getUserById(id);
        
        ApiResponse<UserDetailResponse> response = ApiResponse.success(
                user,
                "User retrieved successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật thông tin user
     * PUT /api/v1/admin/users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDetailResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        
        log.info("Admin updating user with ID: {}", id);
        
        UserDetailResponse updatedUser = userService.updateUser(id, request);
        
        ApiResponse<UserDetailResponse> response = ApiResponse.success(
                updatedUser,
                "User updated successfully"
        );
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa user
     * DELETE /api/v1/admin/users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        log.info("Admin deleting user with ID: {}", id);
        
        userService.deleteUser(id);
        
        ApiResponse<Void> response = ApiResponse.success("User deleted successfully");
        
        return ResponseEntity.ok(response);
    }
}


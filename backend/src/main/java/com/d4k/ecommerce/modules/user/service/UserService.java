package com.d4k.ecommerce.modules.user.service;

import com.d4k.ecommerce.modules.user.dto.request.UpdateUserRequest;
import com.d4k.ecommerce.modules.user.dto.response.UserDetailResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * User Service Interface
 * Định nghĩa business logic cho quản lý users
 */
public interface UserService {
    
    /**
     * Lấy danh sách users có phân trang
     * @param pageable thông tin phân trang
     * @return danh sách users
     */
    Page<UserDetailResponse> getAllUsers(Pageable pageable);
    
    /**
     * Lấy chi tiết user theo ID
     * @param id user ID
     * @return thông tin user
     */
    UserDetailResponse getUserById(Long id);
    
    /**
     * Cập nhật thông tin user
     * @param id user ID
     * @param request thông tin cần cập nhật
     * @return thông tin user sau khi cập nhật
     */
    UserDetailResponse updateUser(Long id, UpdateUserRequest request);
    
    /**
     * Xóa user
     * @param id user ID
     */
    void deleteUser(Long id);
    
    /**
     * Tìm kiếm users theo keyword (email hoặc fullName)
     * @param keyword từ khóa tìm kiếm
     * @param pageable thông tin phân trang
     * @return danh sách users
     */
    Page<UserDetailResponse> searchUsers(String keyword, Pageable pageable);
}


package com.d4k.ecommerce.modules.user.service.impl;

import com.d4k.ecommerce.common.constants.ErrorCodes;
import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.modules.user.dto.request.UpdateUserRequest;
import com.d4k.ecommerce.modules.user.dto.response.UserDetailResponse;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.mapper.UserMapper;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import com.d4k.ecommerce.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User Service Implementation
 * Xử lý business logic cho quản lý users
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    
    /**
     * Lấy danh sách tất cả users có phân trang
     */
    @Override
    @Transactional(readOnly = true)
    public Page<UserDetailResponse> getAllUsers(Pageable pageable) {
        log.info("Fetching all users with page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        
        Page<User> users = userRepository.findAll(pageable);
        
        return users.map(userMapper::toDetailResponse);
    }
    
    /**
     * Lấy chi tiết user theo ID
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetailResponse getUserById(Long id) {
        log.info("Fetching user with ID: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User", "id", id);
                });
        
        return userMapper.toDetailResponse(user);
    }
    
    /**
     * Cập nhật thông tin user
     */
    @Override
    @Transactional
    public UserDetailResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with ID: {}", id);
        
        // Tìm user
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new ResourceNotFoundException("User", "id", id);
                });
        
        // Kiểm tra email mới có bị trùng với user khác không
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                log.error("Email already exists: {}", request.getEmail());
                throw new BusinessException("Email already exists", ErrorCodes.EMAIL_ALREADY_EXISTS);
            }
        }
        
        // Cập nhật thông tin
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }
        
        // Lưu vào database
        User updatedUser = userRepository.save(user);
        log.info("User updated successfully with ID: {}", id);
        
        return userMapper.toDetailResponse(updatedUser);
    }
    
    /**
     * Xóa user
     */
    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with ID: {}", id);
        
        // Kiểm tra user có tồn tại không
        if (!userRepository.existsById(id)) {
            log.error("User not found with ID: {}", id);
            throw new ResourceNotFoundException("User", "id", id);
        }
        
        // Xóa user
        userRepository.deleteById(id);
        log.info("User deleted successfully with ID: {}", id);
    }
    
    /**
     * Tìm kiếm users theo keyword
     * Search trong email và fullName
     */
    @Override
    @Transactional(readOnly = true)
    public Page<UserDetailResponse> searchUsers(String keyword, Pageable pageable) {
        log.info("Searching users with keyword: {}", keyword);
        
        Page<User> users = userRepository.searchByKeyword(keyword, pageable);
        
        return users.map(userMapper::toDetailResponse);
    }
}


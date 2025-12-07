package com.d4k.ecommerce.modules.user.controller;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.d4k.ecommerce.modules.user.dto.request.AddressRequest;
import com.d4k.ecommerce.modules.user.dto.request.ChangePasswordRequest;
import com.d4k.ecommerce.modules.user.dto.request.UpdateProfileRequest;
import com.d4k.ecommerce.modules.user.dto.response.AddressResponse;
import com.d4k.ecommerce.modules.user.dto.response.UserDetailResponse;
import com.d4k.ecommerce.modules.user.entity.Address;
import com.d4k.ecommerce.modules.user.entity.User;
import com.d4k.ecommerce.modules.user.repository.AddressRepository;
import com.d4k.ecommerce.modules.user.repository.UserRepository;
import com.d4k.ecommerce.security.SecurityUtils;
import com.d4k.ecommerce.common.exception.BusinessException;
import com.d4k.ecommerce.common.exception.ResourceNotFoundException;
import com.d4k.ecommerce.common.exception.UnauthorizedException;
import com.d4k.ecommerce.modules.user.mapper.UserMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * User Controller
 * REST API endpoints cho user tự quản lý profile
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class UserController {
    
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    /**
     * Lấy profile của user hiện tại
     * Endpoint: GET /api/v1/users/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDetailResponse>> getProfile() {
        User user = securityUtils.getCurrentUser();
        UserDetailResponse response = userMapper.toDetailResponse(user);
        
        ApiResponse<UserDetailResponse> apiResponse = ApiResponse.<UserDetailResponse>builder()
                .success(true)
                .message("Profile fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Cập nhật profile
     * Endpoint: PUT /api/v1/users/profile
     */
    @PutMapping("/profile")
    @Transactional
    public ResponseEntity<ApiResponse<UserDetailResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        User user = securityUtils.getCurrentUser();
        
        // Check email uniqueness nếu thay đổi
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BusinessException("Email already in use", "EMAIL_ALREADY_EXISTS");
            }
        }
        
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        
        User updatedUser = userRepository.save(user);
        UserDetailResponse response = userMapper.toDetailResponse(updatedUser);
        
        ApiResponse<UserDetailResponse> apiResponse = ApiResponse.<UserDetailResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Đổi password
     * Endpoint: PUT /api/v1/users/change-password
     */
    @PutMapping("/change-password")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        User user = securityUtils.getCurrentUser();
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        
        // Check new password và confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException("New password and confirm password do not match", "PASSWORD_MISMATCH");
        }
        
        // Check new password khác current password
        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new BusinessException("New password must be different from current password", "SAME_PASSWORD");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully")
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Lấy danh sách addresses
     * Endpoint: GET /api/v1/users/addresses
     */
    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses() {
        Long userId = securityUtils.getCurrentUserId();
        List<Address> addresses = addressRepository.findByUserId(userId);
        
        List<AddressResponse> response = addresses.stream()
                .map(this::toAddressResponse)
                .collect(Collectors.toList());
        
        ApiResponse<List<AddressResponse>> apiResponse = ApiResponse.<List<AddressResponse>>builder()
                .success(true)
                .message("Addresses fetched successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Thêm address mới
     * Endpoint: POST /api/v1/users/addresses
     */
    @PostMapping("/addresses")
    @Transactional
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @Valid @RequestBody AddressRequest request
    ) {
        log.info("Request to add address: {}", request);
        User user = securityUtils.getCurrentUser();
        log.info("Current user: {}", user.getEmail());
        
        // Nếu là default address, unset tất cả addresses khác
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            log.info("Unsetting default addresses for user {}", user.getId());
            unsetDefaultAddresses(user.getId());
        }
        
        Address address = Address.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .ward(request.getWard())
                .district(request.getDistrict())
                .city(request.getCity())
                .isDefault(request.getIsDefault())
                .build();
        
        log.info("Saving address: {}", address);
        Address savedAddress = addressRepository.save(address);
        log.info("Address saved with ID: {}", savedAddress.getId());
        
        AddressResponse response = toAddressResponse(savedAddress);
        
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .success(true)
                .message("Address added successfully")
                .data(response)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }
    
    /**
     * Cập nhật address
     * Endpoint: PUT /api/v1/users/addresses/{id}
     */
    @PutMapping("/addresses/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request
    ) {
        Long userId = securityUtils.getCurrentUserId();
        
        Address address = addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));
        
        // Nếu set làm default, unset tất cả addresses khác
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(userId);
        }
        
        address.setReceiverName(request.getReceiverName());
        address.setPhone(request.getPhone());
        address.setAddress(request.getAddress());
        address.setWard(request.getWard());
        address.setDistrict(request.getDistrict());
        address.setCity(request.getCity());
        address.setIsDefault(request.getIsDefault());
        
        Address updatedAddress = addressRepository.save(address);
        AddressResponse response = toAddressResponse(updatedAddress);
        
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .success(true)
                .message("Address updated successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Xóa address
     * Endpoint: DELETE /api/v1/users/addresses/{id}
     */
    @DeleteMapping("/addresses/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        
        Address address = addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));
        
        addressRepository.delete(address);
        
        ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                .success(true)
                .message("Address deleted successfully")
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    /**
     * Set address làm default
     * Endpoint: PUT /api/v1/users/addresses/{id}/default
     */
    @PutMapping("/addresses/{id}/default")
    @Transactional
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        
        Address address = addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));
        
        // Unset tất cả addresses khác
        unsetDefaultAddresses(userId);
        
        // Set address này làm default
        address.setIsDefault(true);
        Address updatedAddress = addressRepository.save(address);
        
        AddressResponse response = toAddressResponse(updatedAddress);
        
        ApiResponse<AddressResponse> apiResponse = ApiResponse.<AddressResponse>builder()
                .success(true)
                .message("Default address set successfully")
                .data(response)
                .build();
        
        return ResponseEntity.ok(apiResponse);
    }
    
    // ============== PRIVATE HELPER METHODS ==============
    
    private void unsetDefaultAddresses(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        addresses.forEach(addr -> addr.setIsDefault(false));
        addressRepository.saveAll(addresses);
    }
    
    private AddressResponse toAddressResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .receiverName(address.getReceiverName())
                .phone(address.getPhone())
                .address(address.getAddress())
                .ward(address.getWard())
                .district(address.getDistrict())
                .city(address.getCity())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}


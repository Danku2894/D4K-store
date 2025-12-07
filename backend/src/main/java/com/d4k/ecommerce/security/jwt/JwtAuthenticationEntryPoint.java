package com.d4k.ecommerce.security.jwt;

import com.d4k.ecommerce.common.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * JWT Authentication Entry Point
 * Handle unauthorized access attempts
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
    // Inject ObjectMapper bean (configured with JavaTimeModule in AppConfig)
    private final ObjectMapper objectMapper;
    
    @Override
    public void commence(HttpServletRequest request,
                        HttpServletResponse response,
                        AuthenticationException authException) throws IOException, ServletException {
        
        log.error("Unauthorized access attempt: {}", authException.getMessage());
        
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        ApiResponse<Void> apiResponse = ApiResponse.error(
                "Unauthorized - Please login to access this resource",
                "UNAUTHORIZED"
        );
        
        // Use injected ObjectMapper (has JavaTimeModule)
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}


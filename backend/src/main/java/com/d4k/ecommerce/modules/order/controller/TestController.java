package com.d4k.ecommerce.modules.order.controller;

import com.d4k.ecommerce.modules.order.dto.request.UpdateOrderStatusRequest;
import com.d4k.ecommerce.modules.order.enums.OrderStatus;
import com.d4k.ecommerce.modules.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.PrintWriter;
import java.io.StringWriter;

@RestController
@RequestMapping("/api/v1/test-order")
@RequiredArgsConstructor
public class TestController {
    
    private final OrderService orderService;
    
    @GetMapping("/{id}")
    public String testUpdate(@PathVariable Long id) {
        try {
            UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
            request.setStatus(OrderStatus.SHIPPING);
            orderService.updateOrderStatus(id, request);
            return "SUCCESS";
        } catch (Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            return sw.toString();
        }
    }
}

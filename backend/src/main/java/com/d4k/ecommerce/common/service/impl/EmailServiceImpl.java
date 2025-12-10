package com.d4k.ecommerce.common.service.impl;

import com.d4k.ecommerce.common.service.EmailService;
import com.d4k.ecommerce.modules.order.entity.Order;
import com.d4k.ecommerce.modules.order.entity.OrderItem;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    @Override
    public void sendEmail(String to, String subject, String body) {
        log.info("Sending email to: {}", to);
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true = isHtml
            
            javaMailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email");
        }
    }

    @Async
    @Override
    public void sendOrderConfirmation(Order order) {
        String subject = "Order Confirmation #" + order.getOrderNumber();
        String body = buildOrderConfirmationEmail(order);
        sendEmail(order.getUser().getEmail(), subject, body);
    }

    @Async
    @Override
    public void sendOrderStatusUpdate(Order order) {
        String subject = "Order Status Update #" + order.getOrderNumber();
        String body = buildOrderStatusUpdateEmail(order);
        sendEmail(order.getUser().getEmail(), subject, body);
    }

    private String buildOrderConfirmationEmail(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h2>Thank you for your order!</h2>");
        sb.append("<p>Hi <b>").append(order.getReceiverName()).append("</b>,</p>");
        sb.append("<p>We have received your order <b>#").append(order.getOrderNumber()).append("</b> and it is now being processed.</p>");
        
        sb.append("<h3>Order Summary</h3>");
        sb.append("<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse;'>");
        sb.append("<tr><th>Product</th><th>Quantity</th><th>Price</th></tr>");
        
        for (OrderItem item : order.getOrderItems()) {
            sb.append("<tr>");
            sb.append("<td>").append(item.getProduct().getName()).append(" - ").append(item.getSize()).append("/").append(item.getColor()).append("</td>");
            sb.append("<td>").append(item.getQuantity()).append("</td>");
            sb.append("<td>").append(formatCurrency(item.getPrice())).append("</td>");
            sb.append("</tr>");
        }
        
        sb.append("</table>");
        sb.append("<p><b>Total: ").append(formatCurrency(order.getTotalAmount())).append("</b></p>");
        
        sb.append("<p>Payment Method: ").append(order.getPaymentMethod()).append("</p>");
        sb.append("<p>Shipping Address: ").append(order.getShippingAddress()).append("</p>");
        
        sb.append("<br/><p>Thank you for shopping with D4K Store!</p>");
        sb.append("</body></html>");
        return sb.toString();
    }

    private String buildOrderStatusUpdateEmail(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<html><body>");
        sb.append("<h2>Order Status Update</h2>");
        sb.append("<p>Hi <b>").append(order.getReceiverName()).append("</b>,</p>");
        sb.append("<p>Your order <b>#").append(order.getOrderNumber()).append("</b> status has been updated to:</p>");
        
        sb.append("<h1 style='color: #e63946;'>").append(order.getStatus()).append("</h1>");
        
        if ("SHIPPED".equals(order.getStatus().name())) {
            sb.append("<p>Your package is on its way!</p>");
        } else if ("DELIVERED".equals(order.getStatus().name())) {
            sb.append("<p>Your package has been delivered. We hope you enjoy your purchase!</p>");
        }
        
        sb.append("<br/><p>Track your order <a href='http://localhost:5173/profile/orders'>here</a>.</p>");
        sb.append("<p>Thank you for shopping with D4K Store!</p>");
        sb.append("</body></html>");
        return sb.toString();
    }

    private String formatCurrency(BigDecimal amount) {
        return NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(amount);
    }
}

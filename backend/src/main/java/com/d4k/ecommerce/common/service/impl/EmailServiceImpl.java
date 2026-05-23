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
        sb.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        sb.append("<style>");
        sb.append("body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0a0a0a; margin: 0; padding: 20px; }");
        sb.append(".container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 4px solid #0a0a0a; padding: 30px; }");
        sb.append(".header { text-align: center; border-bottom: 4px solid #0a0a0a; padding-bottom: 20px; margin-bottom: 20px; }");
        sb.append(".header h1 { font-size: 32px; font-weight: 900; text-transform: uppercase; margin: 0; letter-spacing: -1px; }");
        sb.append(".header h1 span { color: #e63946; }");
        sb.append("h2 { font-size: 24px; font-weight: 900; text-transform: uppercase; border-bottom: 2px solid #0a0a0a; padding-bottom: 10px; margin-top: 30px; }");
        sb.append("p { font-size: 16px; line-height: 1.5; font-weight: 500; }");
        sb.append(".table-wrapper { border: 2px solid #0a0a0a; margin: 20px 0; }");
        sb.append("table { width: 100%; border-collapse: collapse; text-align: left; }");
        sb.append("th { background-color: #0a0a0a; color: #ffffff; padding: 12px; font-weight: bold; text-transform: uppercase; font-size: 14px; }");
        sb.append("td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-weight: 600; font-size: 14px; text-transform: uppercase; }");
        sb.append(".total-row td { background-color: #f1f5f9; font-weight: 900; font-size: 18px; border-bottom: none; }");
        sb.append(".total-price { color: #e63946; text-align: right; }");
        sb.append(".info-box { background-color: #f1f5f9; border: 2px solid #0a0a0a; padding: 15px; margin-top: 20px; }");
        sb.append(".footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #0a0a0a; font-weight: bold; text-transform: uppercase; }");
        sb.append(".btn { display: inline-block; background-color: #0a0a0a; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; border: 2px solid transparent; margin-top: 20px; }");
        sb.append("</style>");
        sb.append("</head><body>");
        sb.append("<div class='container'>");
        
        sb.append("<div class='header'>");
        sb.append("<h1>D4K<span>STORE</span></h1>");
        sb.append("</div>");

        sb.append("<p>HI <b>").append(order.getReceiverName().toUpperCase()).append("</b>,</p>");
        sb.append("<p>THANK YOU FOR YOUR PURCHASE! WE HAVE RECEIVED YOUR ORDER <b>#").append(order.getOrderNumber()).append("</b> AND IT IS NOW BEING PROCESSED.</p>");
        
        sb.append("<h2>ORDER SUMMARY</h2>");
        sb.append("<div class='table-wrapper'>");
        sb.append("<table>");
        sb.append("<tr><th>ITEM</th><th>QTY</th><th>PRICE</th></tr>");
        
        for (OrderItem item : order.getOrderItems()) {
            sb.append("<tr>");
            sb.append("<td>").append(item.getProduct().getName());
            if (item.getSize() != null || item.getColor() != null) {
                sb.append("<br><span style='font-size:12px;color:#64748b;'>");
                if (item.getSize() != null) sb.append("SIZE: ").append(item.getSize());
                if (item.getColor() != null) sb.append(" | COLOR: ").append(item.getColor());
                sb.append("</span>");
            }
            sb.append("</td>");
            sb.append("<td>").append(item.getQuantity()).append("</td>");
            sb.append("<td>").append(formatCurrency(item.getPrice())).append("</td>");
            sb.append("</tr>");
        }
        
        sb.append("<tr class='total-row'><td colspan='2'>TOTAL</td><td class='total-price'>").append(formatCurrency(order.getTotalAmount())).append("</td></tr>");
        sb.append("</table>");
        sb.append("</div>");
        
        sb.append("<div class='info-box'>");
        sb.append("<p><b>PAYMENT METHOD:</b> ").append(order.getPaymentMethod()).append("</p>");
        sb.append("<p><b>SHIPPING ADDRESS:</b> ").append(order.getShippingAddress()).append("</p>");
        sb.append("</div>");
        
        sb.append("<center><a href='http://localhost:5173/profile/orders' class='btn'>VIEW ORDER HISTORY</a></center>");
        
        sb.append("<div class='footer'>STAY STREET. D4K STORE.</div>");
        sb.append("</div></body></html>");
        
        return sb.toString();
    }

    private String buildOrderStatusUpdateEmail(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head><meta charset='UTF-8'>");
        sb.append("<style>");
        sb.append("body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0a0a0a; margin: 0; padding: 20px; }");
        sb.append(".container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 4px solid #0a0a0a; padding: 30px; }");
        sb.append(".header { text-align: center; border-bottom: 4px solid #0a0a0a; padding-bottom: 20px; margin-bottom: 20px; }");
        sb.append(".header h1 { font-size: 32px; font-weight: 900; text-transform: uppercase; margin: 0; letter-spacing: -1px; }");
        sb.append(".header h1 span { color: #e63946; }");
        sb.append("p { font-size: 16px; line-height: 1.5; font-weight: 500; }");
        sb.append(".status-box { text-align: center; border: 4px solid #0a0a0a; padding: 20px; margin: 30px 0; background-color: #f1f5f9; }");
        sb.append(".status-title { font-size: 14px; font-weight: bold; color: #64748b; margin-bottom: 10px; text-transform: uppercase; }");
        sb.append(".status-text { font-size: 32px; font-weight: 900; color: #e63946; margin: 0; text-transform: uppercase; letter-spacing: 2px; }");
        sb.append(".footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #0a0a0a; font-weight: bold; text-transform: uppercase; }");
        sb.append(".btn { display: inline-block; background-color: #0a0a0a; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; border: 2px solid transparent; margin-top: 20px; }");
        sb.append("</style>");
        sb.append("</head><body>");
        sb.append("<div class='container'>");
        
        sb.append("<div class='header'>");
        sb.append("<h1>D4K<span>STORE</span></h1>");
        sb.append("</div>");

        sb.append("<p>HI <b>").append(order.getReceiverName().toUpperCase()).append("</b>,</p>");
        sb.append("<p>YOUR ORDER <b>#").append(order.getOrderNumber()).append("</b> STATUS HAS BEEN UPDATED.</p>");
        
        sb.append("<div class='status-box'>");
        sb.append("<div class='status-title'>CURRENT STATUS</div>");
        sb.append("<h2 class='status-text'>").append(order.getStatus()).append("</h2>");
        sb.append("</div>");
        
        if ("SHIPPING".equals(order.getStatus().name())) {
            sb.append("<p style='text-align:center; font-weight:bold;'>YOUR PACKAGE IS ON ITS WAY! 🚚</p>");
        } else if ("DELIVERED".equals(order.getStatus().name())) {
            sb.append("<p style='text-align:center; font-weight:bold;'>YOUR PACKAGE HAS BEEN DELIVERED. WE HOPE YOU ENJOY YOUR PURCHASE! 🎉</p>");
        }
        
        sb.append("<center><a href='http://localhost:5173/profile/orders' class='btn'>TRACK YOUR ORDER</a></center>");
        
        sb.append("<div class='footer'>STAY STREET. D4K STORE.</div>");
        sb.append("</div></body></html>");
        return sb.toString();
    }

    private String formatCurrency(BigDecimal amount) {
        return NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(amount);
    }
}

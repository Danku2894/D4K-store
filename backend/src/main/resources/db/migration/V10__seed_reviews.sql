-- =====================================================
-- Migration: V10 - Seed Sample Reviews
-- Description: Thêm dữ liệu mẫu cho reviews
-- Author: D4K E-commerce Team
-- Date: 2025-11-27
-- =====================================================

-- Giả sử có user với ID 2, 3, 4 (không phải admin)
-- Và các products từ V6 đã seed

-- Reviews cho Áo Thun Nam Basic (product_id = 1)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(2, 1, 5, 'Áo rất đẹp, chất liệu cotton thoáng mát. Mặc rất thoải mái!', NOW() - INTERVAL '30 days');

-- Reviews cho Quần Jeans Nam Slim Fit (product_id = 2)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(2, 2, 4, 'Quần đẹp, form dáng chuẩn. Chất jean hơi cứng nhưng mặc vài lần sẽ mềm.', NOW() - INTERVAL '25 days');

-- Reviews cho Áo Sơ Mi Nữ Công Sở (product_id = 3)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(3, 3, 5, 'Áo sơ mi sang trọng, phù hợp đi làm. Chất liệu không nhăn.', NOW() - INTERVAL '20 days');

-- Reviews cho Váy Đầm Nữ Dạ Hội (product_id = 4)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(3, 4, 5, 'Váy cực kỳ sang trọng và quyến rũ. Đi dự tiệc nhận được nhiều lời khen!', NOW() - INTERVAL '15 days');

-- Reviews cho Áo Khoác Hoodie Unisex (product_id = 5)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(2, 5, 5, 'Áo hoodie chất lượng tốt, giữ ấm rất tốt. Thiết kế đơn giản nhưng đẹp.', NOW() - INTERVAL '10 days'),
(3, 5, 4, 'Áo ổn, nhưng size hơi to. Nên chọn size nhỏ hơn 1 size so với bình thường.', NOW() - INTERVAL '8 days');

-- Reviews cho Áo Polo Nam Cao Cấp (product_id = 6)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(2, 6, 4, 'Áo polo đẹp, phù hợp mặc đi chơi. Chất liệu thoáng.', NOW() - INTERVAL '5 days');

-- Reviews cho Quần Short Nữ Thể Thao (product_id = 7)
INSERT INTO reviews (user_id, product_id, rating, comment, created_at) VALUES
(3, 7, 5, 'Quần short thoải mái, phù hợp tập gym và chạy bộ. Thấm hút mồ hôi tốt.', NOW() - INTERVAL '3 days');

-- NOTE: Những reviews này giả định rằng users đã mua các sản phẩm.
-- Trong thực tế, cần validate qua Order table trước khi cho phép review.

COMMENT ON TABLE reviews IS 'Reviews đã được seed với dữ liệu mẫu từ nhiều users';


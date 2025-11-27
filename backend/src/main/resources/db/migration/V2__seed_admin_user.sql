-- Seed admin user for testing
-- Migration V2: Insert default admin account

-- Password: admin123 (BCrypt hash)
INSERT INTO users (full_name, email, password, role, is_active, created_at, updated_at)
VALUES (
    'Administrator',
    'admin@d4k.com',
    '$2a$10$XkR3LqZZ5N5Z5Z5Z5Z5Z5u5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', -- This is a placeholder, will be replaced
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Note: Để hash password thực tế, chạy command sau trong Java:
-- BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
-- String hashedPassword = encoder.encode("admin123");
-- System.out.println(hashedPassword);

-- Sau đó update lại password trong database hoặc update migration này với hash thực tế

COMMENT ON TABLE users IS 'User accounts - admin@d4k.com / admin123 for testing';


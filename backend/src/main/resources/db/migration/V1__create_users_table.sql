-- Create users table
-- Migration V1: Authentication & User Management

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email (for faster lookup)
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);

-- Create index for role
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);

-- Add comment
COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON COLUMN users.role IS 'User role: ADMIN or USER';
COMMENT ON COLUMN users.is_active IS 'Account status - can be used to disable accounts';


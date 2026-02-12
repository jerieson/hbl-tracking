-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('Administrator', 'Sales Executive') DEFAULT 'Sales Executive',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Modified customers table with user_id
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  country_code VARCHAR(10),
  contact_number VARCHAR(50),
  designation VARCHAR(100),
  company_name VARCHAR(255) NOT NULL,
  business_address VARCHAR(500) NOT NULL,
  nature_of_business VARCHAR(255),
  area VARCHAR(100),
  remarks TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  tapped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_company_name (company_name),
  INDEX idx_status (status),
  INDEX idx_tapped (tapped),
  INDEX idx_area (area),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration script to add user_id to existing customers table
-- Run this if you already have data
-- ALTER TABLE customers ADD COLUMN user_id INT AFTER id;
-- UPDATE customers SET user_id = 1 WHERE user_id IS NULL; -- Assign to first user
-- ALTER TABLE customers MODIFY user_id INT NOT NULL;
-- ALTER TABLE customers ADD CONSTRAINT fk_customer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
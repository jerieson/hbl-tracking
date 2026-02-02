CREATE DATABASE IF NOT EXISTS citadines_tracking;
USE citadines_tracking;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255),
  country_code VARCHAR(10),
  contact_number VARCHAR(50),
  designation VARCHAR(100),
  company_name VARCHAR(255) NOT NULL,
  business_address VARCHAR(500) NOT NULL,
  nature_of_business VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  area VARCHAR(100),
  remarks TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  tapped BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_company_name (company_name),
  INDEX idx_status (status),
  INDEX idx_tapped (tapped),
  INDEX idx_area (area),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Create Database
CREATE DATABASE IF NOT EXISTS electricity_outage_db;
USE electricity_outage_db;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Areas Table
CREATE TABLE IF NOT EXISTS areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    total_users INT NOT NULL
);

-- Create Outages Table
CREATE TABLE IF NOT EXISTS outages (
    outage_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    area_id INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reported_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restoration_time TIMESTAMP NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'REPORTED',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (area_id) REFERENCES areas(area_id)
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    outage_id INT NOT NULL,
    message TEXT NOT NULL,
    sent_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (outage_id) REFERENCES outages(outage_id)
);

-- Insert Sample Data
INSERT INTO areas (area_name, region, total_users) VALUES
('Downtown District', 'Central', 5000),
('Suburban Zone A', 'North', 3500),
('Suburban Zone B', 'South', 4200),
('Industrial Area', 'East', 2000),
('Residential Complex', 'West', 6000);

INSERT INTO users (username, email, password, phone, address, user_type) VALUES
('admin', 'admin@electricity.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QIDM', '1234567890', 'Admin Office', 'ADMIN'),
('user1', 'user1@email.com', '$2a$10$slYQmyNdGzin7olVN3p5Be7DlH.PKZbv5H8KnzzVgXXbVxzy2QIDM', '9876543210', '123 Main St', 'USER');

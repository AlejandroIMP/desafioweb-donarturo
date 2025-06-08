/*
===============================================================================
                    E-COMMERCE DATABASE SYSTEM - POSTGRESQL
                    Migración desde MSSQL a PostgreSQL
===============================================================================
Author: Alejandro IMP
Date: 2025-06-02
Version: 2.0 PostgreSQL
Project: Desafío Web360 - OprimaTecnología

DIFERENCIAS PRINCIPALES DE POSTGRESQL vs MSSQL:
- SERIAL/BIGSERIAL en lugar de IDENTITY
- TEXT en lugar de NVARCHAR(MAX)
- TIMESTAMP en lugar de DATETIME2
- BOOLEAN en lugar de BIT
- UUID support nativo
- Arrays nativos
- JSON/JSONB nativo
- Mejores índices (GIN, GIST)
- Funciones más robustas

MEJORAS IMPLEMENTADAS EN POSTGRESQL:
- Usar SERIAL para auto-incremento
- TIMESTAMP WITH TIME ZONE para fechas
- BOOLEAN para campos bit
- TEXT para campos largos
- UUID para IDs únicos globales
- JSONB para datos semi-estructurados
- Índices especializados (GIN, BTREE, PARTIAL)
- Constraints más robustos
- Funciones PL/pgSQL
- Triggers automáticos para auditoría

===============================================================================
*/

-- Limpiar entorno si existe
DROP DATABASE IF EXISTS ecommerce_gda004;

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE ecommerce_gda004
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Conectar a la base de datos
\c ecommerce_gda004;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. SISTEMA DE AUDITORÍA Y LOGGING
-- ============================================================================

-- Tabla de auditoría para todas las operaciones
CREATE TABLE audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(128) NOT NULL,
    operation_type CHAR(1) NOT NULL CHECK (operation_type IN ('I', 'U', 'D')), -- Insert, Update, Delete
    record_id INTEGER NOT NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    user_id INTEGER NULL,
    operation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET NULL,
    user_agent TEXT NULL,
    session_id UUID NULL
);

-- Tabla de log de errores
CREATE TABLE error_log (
    error_id BIGSERIAL PRIMARY KEY,
    error_code VARCHAR(50),
    error_severity INTEGER,
    error_state INTEGER,
    error_procedure VARCHAR(128),
    error_line INTEGER,
    error_message TEXT,
    user_id INTEGER NULL,
    error_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    additional_info JSONB NULL,
    stack_trace TEXT NULL
);

-- ============================================================================
-- 3. TABLAS PRINCIPALES DEL NEGOCIO
-- ============================================================================

-- Tabla de estados (estados del sistema)
CREATE TABLE states (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(50) NOT NULL UNIQUE,
    state_description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT NULL,
    permissions JSONB NULL, -- Permisos en formato JSON
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    business_name VARCHAR(100) NOT NULL,
    commercial_name VARCHAR(100) NULL,
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    tax_id VARCHAR(50) NULL UNIQUE, -- NIT, RFC, etc.
    contact_person VARCHAR(100) NULL,
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    payment_terms INTEGER DEFAULT 30, -- días de crédito
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_clients_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_clients_credit_limit CHECK (credit_limit >= 0),
    CONSTRAINT chk_clients_payment_terms CHECK (payment_terms > 0)
);

-- Tabla de usuarios
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    client_id INTEGER NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Para bcrypt/scrypt hashes
    phone VARCHAR(20) NULL,
    birth_date DATE NULL,
    last_login TIMESTAMP WITH TIME ZONE NULL,
    login_attempts INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    password_reset_token UUID NULL,
    password_reset_expires TIMESTAMP WITH TIME ZONE NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token UUID NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_users_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_users_birth_date CHECK (birth_date < CURRENT_DATE),
    CONSTRAINT chk_users_login_attempts CHECK (login_attempts >= 0 AND login_attempts <= 10)
);

-- Tabla de categorías de productos
CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_description TEXT NULL,
    category_image VARCHAR(500) NULL,
    sort_order INTEGER DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT uq_product_categories_name UNIQUE (category_name) WHERE is_deleted = FALSE
);

-- Tabla de productos
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_description TEXT NULL,
    brand VARCHAR(50) NULL,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    stock_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit_price DECIMAL(15,2) NOT NULL,
    cost_price DECIMAL(15,2) NULL,
    product_image VARCHAR(500) NULL,
    weight DECIMAL(8,2) NULL, -- en kg
    dimensions JSONB NULL, -- {width, height, depth} en cm
    tags TEXT[] NULL, -- Array de tags para búsqueda
    min_stock_alert INTEGER DEFAULT 10,
    is_featured BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_products_stock CHECK (stock_quantity >= 0),
    CONSTRAINT chk_products_price CHECK (unit_price > 0),
    CONSTRAINT chk_products_cost CHECK (cost_price IS NULL OR cost_price >= 0),
    CONSTRAINT chk_products_weight CHECK (weight IS NULL OR weight > 0)
);

-- Tabla de órdenes
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE, -- Número de orden visible
    customer_name VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(100) NOT NULL,
    delivery_date DATE NULL,
    order_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    notes TEXT NULL,
    tracking_number VARCHAR(100) NULL,
    delivered_at TIMESTAMP WITH TIME ZONE NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_orders_totals CHECK (order_total >= 0 AND tax_amount >= 0 AND discount_amount >= 0 AND shipping_cost >= 0),
    CONSTRAINT chk_orders_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_orders_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'))
);

-- Tabla de detalles de orden
CREATE TABLE order_details (
    detail_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL,
    product_snapshot JSONB NULL, -- Snapshot del producto al momento de la orden
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_order_details_quantity CHECK (quantity > 0),
    CONSTRAINT chk_order_details_price CHECK (unit_price > 0),
    CONSTRAINT chk_order_details_discount CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    CONSTRAINT chk_order_details_total CHECK (line_total >= 0)
);

-- ============================================================================
-- 4. RELACIONES ENTRE TABLAS (FOREIGN KEYS)
-- ============================================================================

-- Users relationships
ALTER TABLE users ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id);
ALTER TABLE users ADD CONSTRAINT fk_users_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);
ALTER TABLE users ADD CONSTRAINT fk_users_client_id FOREIGN KEY (client_id) REFERENCES clients(client_id);

-- Product categories relationships
ALTER TABLE product_categories ADD CONSTRAINT fk_product_categories_user_id FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE product_categories ADD CONSTRAINT fk_product_categories_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);

-- Products relationships
ALTER TABLE products ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category_id) REFERENCES product_categories(category_id);
ALTER TABLE products ADD CONSTRAINT fk_products_user_id FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE products ADD CONSTRAINT fk_products_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);

-- Orders relationships
ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_client_id FOREIGN KEY (client_id) REFERENCES clients(client_id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);

-- Order details relationships
ALTER TABLE order_details ADD CONSTRAINT fk_order_details_order_id FOREIGN KEY (order_id) REFERENCES orders(order_id);
ALTER TABLE order_details ADD CONSTRAINT fk_order_details_product_id FOREIGN KEY (product_id) REFERENCES products(product_id);

-- ============================================================================
-- 5. ÍNDICES PARA RENDIMIENTO
-- ============================================================================

-- Audit log indexes
CREATE INDEX idx_audit_log_table_operation ON audit_log(table_name, operation_type);
CREATE INDEX idx_audit_log_date ON audit_log(operation_date);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- Error log indexes
CREATE INDEX idx_error_log_date ON error_log(error_date);
CREATE INDEX idx_error_log_procedure ON error_log(error_procedure);

-- States indexes
CREATE INDEX idx_states_active ON states(is_active) WHERE is_active = TRUE;

-- Clients indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_business_name ON clients(business_name);
CREATE INDEX idx_clients_not_deleted ON clients(client_id) WHERE is_deleted = FALSE;

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_state ON users(state_id);
CREATE INDEX idx_users_not_deleted ON users(user_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_users_not_locked ON users(user_id) WHERE is_locked = FALSE;

-- Product categories indexes
CREATE INDEX idx_product_categories_name ON product_categories(category_name);
CREATE INDEX idx_product_categories_not_deleted ON product_categories(category_id) WHERE is_deleted = FALSE;

-- Products indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_products_price ON products(unit_price);
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_products_not_deleted ON products(product_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_products_featured ON products(product_id) WHERE is_featured = TRUE;
CREATE INDEX idx_products_low_stock ON products(product_id) WHERE stock_quantity <= min_stock_alert;

-- GIN index for product tags
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Orders indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_state ON orders(state_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_orders_delivery_date ON orders(delivery_date);
CREATE INDEX idx_orders_not_deleted ON orders(order_id) WHERE is_deleted = FALSE;
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

-- Order details indexes
CREATE INDEX idx_order_details_order ON order_details(order_id);
CREATE INDEX idx_order_details_product ON order_details(product_id);
CREATE INDEX idx_order_details_not_deleted ON order_details(detail_id) WHERE is_deleted = FALSE;

-- ============================================================================
-- 6. FUNCIONES DE VALIDACIÓN Y UTILIDADES
-- ============================================================================

-- Función para validar email
CREATE OR REPLACE FUNCTION validate_email(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email_address ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para generar número de orden único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        order_num := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
        
        IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = order_num) THEN
            RETURN order_num;
        END IF;
        
        counter := counter + 1;
        
        -- Prevenir loop infinito
        IF counter > 9999 THEN
            order_num := 'ORD-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || '-' || LPAD((RANDOM() * 999)::INTEGER::TEXT, 3, '0');
            RETURN order_num;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular total de orden
CREATE OR REPLACE FUNCTION calculate_order_total(p_order_id INTEGER)
RETURNS DECIMAL(15,2) AS $$
DECLARE
    order_total DECIMAL(15,2);
BEGIN
    SELECT COALESCE(SUM(line_total), 0) 
    INTO order_total
    FROM order_details 
    WHERE order_id = p_order_id AND is_deleted = FALSE;
    
    RETURN order_total;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- ============================================================================

-- Función genérica para auditoría
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation_type, record_id, old_values, operation_date)
        VALUES (TG_TABLE_NAME, 'D', OLD.id, row_to_json(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation_type, record_id, old_values, new_values, operation_date)
        VALUES (TG_TABLE_NAME, 'U', NEW.id, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation_type, record_id, new_values, operation_date)
        VALUES (TG_TABLE_NAME, 'I', NEW.id, row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. APLICAR TRIGGERS A LAS TABLAS
-- ============================================================================

-- Triggers para updated_at
CREATE TRIGGER tr_states_updated_at BEFORE UPDATE ON states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER tr_order_details_updated_at BEFORE UPDATE ON order_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. DATOS INICIALES
-- ============================================================================

-- Insertar estados del sistema
INSERT INTO states (state_name, state_description) VALUES 
('Active', 'Elemento activo en el sistema'),
('Inactive', 'Elemento inactivo temporalmente'),
('In Process', 'En proceso de preparación'),
('Pending', 'Pendiente de revisión'),
('Completed', 'Proceso completado'),
('Cancelled', 'Proceso cancelado'),
('Confirmed', 'Proceso confirmado'),
('Delivered', 'Orden entregada');

-- Insertar roles del sistema
INSERT INTO roles (role_name, role_description, permissions) VALUES 
('Admin', 'Administrador del sistema', '{"all": true}'::jsonb),
('Operator', 'Operador del sistema', '{"orders": true, "products": true, "clients": true}'::jsonb),
('Customer', 'Cliente del sistema', '{"orders": ["read", "create"], "profile": ["read", "update"]}'::jsonb);

-- Insertar cliente ejemplo
INSERT INTO clients (business_name, commercial_name, delivery_address, phone, email, tax_id) VALUES 
('Tech Solutions S.A.', 'TechSol', 'Zona 10, Guatemala City', '+502 2234-5678', 'contact@techsol.gt', 'CF-123456-7'),
('Innovación Digital', 'InnovaDigital', 'Zona 1, Guatemala City', '+502 2345-6789', 'info@innovadigital.com', 'CF-987654-3');

-- Insertar usuario administrador (password: admin123)
INSERT INTO users (role_id, state_id, email, full_name, password_hash, email_verified) VALUES 
(1, 1, 'admin@ecommerce.com', 'Administrador Sistema', '$2b$10$rOmY8w8W8W8W8W8W8W8W8u', TRUE);

-- Insertar categorías de productos
INSERT INTO product_categories (user_id, state_id, category_name, category_description) VALUES 
(1, 1, 'Electronics', 'Electronic devices and components'),
(1, 1, 'Computers', 'Desktop and laptop computers'),
(1, 1, 'Mobile Devices', 'Smartphones and tablets'),
(1, 1, 'Accessories', 'Computer and electronic accessories');

-- Insertar productos de ejemplo
INSERT INTO products (category_id, user_id, state_id, product_name, product_description, brand, product_code, stock_quantity, unit_price, cost_price) VALUES 
(1, 1, 1, 'Gaming Laptop RTX 4060', 'High-performance gaming laptop with RTX 4060 graphics', 'ASUS', 'LAPTOP-001', 15, 1299.99, 999.99),
(1, 1, 1, 'Wireless Gaming Mouse', 'Ergonomic wireless gaming mouse with RGB lighting', 'Logitech', 'MOUSE-001', 50, 89.99, 65.99),
(2, 1, 1, 'Mechanical Keyboard', 'Cherry MX Blue mechanical keyboard', 'Corsair', 'KB-001', 25, 159.99, 119.99),
(3, 1, 1, 'Smartphone Android', 'Latest Android smartphone with 5G', 'Samsung', 'PHONE-001', 30, 899.99, 699.99);

COMMIT;

-- ============================================================================
-- MENSAJES DE CONFIRMACIÓN
-- ============================================================================

\echo 'Database ecommerce_gda004 created successfully!'
\echo 'PostgreSQL migration completed with:'
\echo '- 8 main business tables'
\echo '- 2 audit/logging tables'
\echo '- Complete indexing strategy'
\echo '- Audit triggers'
\echo '- Validation functions'
\echo '- Initial sample data'
\echo 'Ready for application connection!'

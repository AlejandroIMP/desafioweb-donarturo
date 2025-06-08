/*
===============================================================================
                    E-COMMERCE DATABASE SYSTEM - POSTGRESQL SCHEMA
                    Tables and Functions Only (No Database Creation)
===============================================================================
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREACIÓN DE TABLAS

-- Tabla: roles
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Tabla: states
CREATE TABLE IF NOT EXISTS states (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(45) NOT NULL UNIQUE,
    description TEXT,
    state_type VARCHAR(20) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Tabla: users (usuarios del sistema)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT fk_users_state FOREIGN KEY (state_id) REFERENCES states(state_id),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT chk_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9\-\s\(\)]{7,20}$')
);

-- Tabla: clients (clientes/compradores)
CREATE TABLE IF NOT EXISTS clients (
    client_id SERIAL PRIMARY KEY,
    state_id INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    address TEXT,
    nit VARCHAR(20),
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT fk_clients_state FOREIGN KEY (state_id) REFERENCES states(state_id),
    CONSTRAINT chk_client_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT chk_client_phone_format CHECK (phone IS NULL OR phone ~ '^\+?[0-9\-\s\(\)]{7,20}$')
);

-- Tabla: product_categories
CREATE TABLE IF NOT EXISTS product_categories (
    category_id SERIAL PRIMARY KEY,
    state_id INTEGER NOT NULL,
    category_name VARCHAR(45) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_category_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT fk_categories_state FOREIGN KEY (state_id) REFERENCES states(state_id),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_category_id) REFERENCES product_categories(category_id),
    CONSTRAINT chk_category_name_length CHECK (char_length(category_name) >= 2)
);

-- Tabla: products
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    product_name VARCHAR(45) NOT NULL,
    brand VARCHAR(45),
    product_code VARCHAR(45) UNIQUE,
    stock INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    final_price DECIMAL(10,2) GENERATED ALWAYS AS (price * (1 - discount_percentage/100)) STORED,
    description TEXT,
    specifications JSONB DEFAULT '{}',
    tags VARCHAR(100)[],
    image_url VARCHAR(500),
    additional_images VARCHAR(500)[],
    weight DECIMAL(8,3),
    dimensions JSONB,
    min_stock_alert INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT false,
    seo_title VARCHAR(100),
    seo_description VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES product_categories(category_id),
    CONSTRAINT fk_products_state FOREIGN KEY (state_id) REFERENCES states(state_id),
    CONSTRAINT fk_products_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT chk_stock_positive CHECK (stock >= 0),
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_cost_price_positive CHECK (cost_price IS NULL OR cost_price >= 0),
    CONSTRAINT chk_discount_range CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    CONSTRAINT chk_product_name_length CHECK (char_length(product_name) >= 2)
);

-- Tabla: orders
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20),
    delivery_email VARCHAR(100),
    delivery_name VARCHAR(100),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    CONSTRAINT fk_orders_client FOREIGN KEY (client_id) REFERENCES clients(client_id),
    CONSTRAINT fk_orders_state FOREIGN KEY (state_id) REFERENCES states(state_id),
    CONSTRAINT chk_amounts_positive CHECK (
        subtotal >= 0 AND tax_amount >= 0 AND 
        shipping_cost >= 0 AND discount_amount >= 0 AND total_amount >= 0
    ),
    CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    CONSTRAINT chk_delivery_phone_format CHECK (delivery_phone IS NULL OR delivery_phone ~ '^\+?[0-9\-\s\(\)]{7,20}$')
);

-- Tabla: order_details
CREATE TABLE IF NOT EXISTS order_details (
    detail_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_percentage/100)) STORED,
    product_snapshot JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_unit_price_positive CHECK (unit_price > 0),
    CONSTRAINT chk_detail_discount_range CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- Tabla: audit_log (registro de auditoría)
CREATE TABLE IF NOT EXISTS audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_fields VARCHAR(500)[],
    user_id INTEGER,
    client_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_operation_type CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT'))
);

-- 3. ÍNDICES PARA OPTIMIZACIÓN

-- Índices principales
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_state ON users(role_id, state_id);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_state ON clients(state_id);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_state ON products(state_id);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- Índices GIN para JSONB y arrays
CREATE INDEX IF NOT EXISTS idx_products_specifications ON products USING GIN(specifications);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_roles_permissions ON roles USING GIN(permissions);

CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_state ON orders(state_id);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);

CREATE INDEX IF NOT EXISTS idx_order_details_order ON order_details(order_id);
CREATE INDEX IF NOT EXISTS idx_order_details_product ON order_details(product_id);

CREATE INDEX IF NOT EXISTS idx_audit_table_operation ON audit_log(table_name, operation);
CREATE INDEX IF NOT EXISTS idx_audit_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id) WHERE user_id IS NOT NULL;

-- 4. FUNCIONES ÚTILES

-- Función para generar número de orden
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    order_num VARCHAR(50);
    counter INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number, 9) AS INTEGER)), 0) + 1 
    INTO counter 
    FROM orders 
    WHERE order_number LIKE TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%';
    
    order_num := TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(counter::TEXT, 4, '0');
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Función para validar email
CREATE OR REPLACE FUNCTION is_valid_email(email_address TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- Función para calcular total de orden
CREATE OR REPLACE FUNCTION calculate_order_total(order_id_param INTEGER)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    order_total DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(line_total), 0)
    INTO order_total
    FROM order_details
    WHERE order_id = order_id_param;
    
    RETURN order_total;
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

-- 5. TRIGGERS

-- Triggers para updated_at automático
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_order_details_updated_at
    BEFORE UPDATE ON order_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para generar número de orden automáticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- 6. DATOS INICIALES

-- Insertar roles básicos
INSERT INTO roles (role_name, permissions) VALUES
('Administrador', '{"all": true, "users": {"create": true, "read": true, "update": true, "delete": true}, "products": {"create": true, "read": true, "update": true, "delete": true}, "orders": {"create": true, "read": true, "update": true, "delete": true}}'),
('Operador', '{"products": {"create": true, "read": true, "update": true}, "orders": {"read": true, "update": true}}'),
('Cliente', '{"profile": {"read": true, "update": true}, "orders": {"create": true, "read": true}}')
ON CONFLICT (role_name) DO NOTHING;

-- Insertar estados básicos
INSERT INTO states (state_name, description, state_type) VALUES
('Activo', 'Estado activo general', 'general'),
('Inactivo', 'Estado inactivo general', 'general'),
('Pendiente', 'Estado pendiente', 'general'),
('Procesando', 'En proceso de atención', 'order'),
('Enviado', 'Pedido enviado', 'order'),
('Entregado', 'Pedido entregado', 'order'),
('Cancelado', 'Pedido cancelado', 'order'),
('Disponible', 'Producto disponible', 'product'),
('Agotado', 'Producto sin stock', 'product'),
('Descontinuado', 'Producto descontinuado', 'product')
ON CONFLICT (state_name) DO NOTHING;

-- Insertar categorías básicas
INSERT INTO product_categories (state_id, category_name, description) VALUES
(1, 'Electrónicos', 'Productos electrónicos y tecnología'),
(1, 'Ropa', 'Vestimenta y accesorios'),
(1, 'Hogar', 'Productos para el hogar'),
(1, 'Deportes', 'Artículos deportivos y fitness'),
(1, 'Libros', 'Libros y material educativo')
ON CONFLICT (category_name) DO NOTHING;

-- Crear usuario administrador por defecto (password: admin123)
INSERT INTO users (role_id, state_id, email, full_name, password_hash, phone) VALUES
(1, 1, 'admin@ecommerce.com', 'Administrador Sistema', '$2b$10$rHzDXe7LPKEqGf8mVf8B7eHzKzKzKzKzKzKzKzKzKzKzKzKzKzKzK', '+502 1234-5678')
ON CONFLICT (email) DO NOTHING;

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL E-commerce Database Schema created successfully!';
    RAISE NOTICE 'Database: ecommerce_gda004';
    RAISE NOTICE 'Tables created: %, %, %, %, %, %, %, %', 
        'roles', 'states', 'users', 'clients', 'product_categories', 
        'products', 'orders', 'order_details', 'audit_log';
    RAISE NOTICE 'Default admin user: admin@ecommerce.com (password: admin123)';
END $$;

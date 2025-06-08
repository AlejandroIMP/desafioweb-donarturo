/*
===============================================================================
                         E-COMMERCE DATABASE SYSTEM
                     Improved Version with Best Practices
===============================================================================
Author: Alejandro IMP
Date: 2025-06-02
Version: 2.0
Project: Desafío Web360 - OprimaTecnología

IMPROVEMENTS IMPLEMENTED:
- Standardized snake_case nomenclature
- Complete logging/audit system
- Business validation procedures
- Performance indexes
- Soft delete implementation
- Explicit parameter types
- Complete procedure documentation
- Separation of concerns

STRUCTURE:
1. DATABASE AND SCHEMA CREATION
2. AUDIT AND LOGGING TABLES
3. MAIN BUSINESS TABLES WITH CONSTRAINTS
4. INDEXES FOR PERFORMANCE
5. VALIDATION PROCEDURES
6. BUSINESS LOGIC PROCEDURES (CRUD)
7. AUDIT TRIGGERS
8. BUSINESS VIEWS
9. INITIAL DATA INSERTION

===============================================================================
*/

-- Clean environment
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ecommerce_gda004')
    DROP DATABASE ecommerce_gda004;

-- 1. DATABASE CREATION
CREATE DATABASE ecommerce_gda004
COLLATE SQL_Latin1_General_CP1_CI_AS;

USE ecommerce_gda004;

-- Enable advanced features
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE;

-- ============================================================================
-- 2. AUDIT AND LOGGING SYSTEM
-- ============================================================================

-- Audit log table for all operations
CREATE TABLE audit_log (
    audit_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    table_name NVARCHAR(128) NOT NULL,
    operation_type CHAR(1) NOT NULL CHECK (operation_type IN ('I', 'U', 'D')), -- Insert, Update, Delete
    record_id INT NOT NULL,
    old_values NVARCHAR(MAX) NULL,
    new_values NVARCHAR(MAX) NULL,
    user_id INT NULL,
    operation_date DATETIME2 DEFAULT GETDATE(),
    ip_address NVARCHAR(45) NULL,
    user_agent NVARCHAR(500) NULL
);

-- Error log table
CREATE TABLE error_log (
    error_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    error_number INT,
    error_severity INT,
    error_state INT,
    error_procedure NVARCHAR(128),
    error_line INT,
    error_message NVARCHAR(4000),
    user_id INT NULL,
    error_date DATETIME2 DEFAULT GETDATE(),
    additional_info NVARCHAR(MAX) NULL
);

-- ============================================================================
-- 3. MAIN BUSINESS TABLES
-- ============================================================================

-- States table (system-wide states)
CREATE TABLE states (
    state_id INT IDENTITY(1,1) PRIMARY KEY,
    state_name NVARCHAR(50) NOT NULL UNIQUE,
    state_description NVARCHAR(255) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Roles table
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL UNIQUE,
    role_description NVARCHAR(255) NULL,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Clients table
CREATE TABLE clients (
    client_id INT IDENTITY(1,1) PRIMARY KEY,
    business_name NVARCHAR(100) NOT NULL,
    commercial_name NVARCHAR(100) NULL,
    delivery_address NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    tax_id NVARCHAR(20) NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_clients_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT CK_clients_phone CHECK (LEN(phone) >= 8)
);

-- Users table
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    state_id INT NOT NULL,
    client_id INT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    full_name NVARCHAR(100) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL, -- For bcrypt/scrypt hashes
    phone NVARCHAR(20) NULL,
    birth_date DATE NULL,
    last_login DATETIME2 NULL,
    login_attempts INT DEFAULT 0,
    is_locked BIT DEFAULT 0,
    locked_until DATETIME2 NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_users_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT CK_users_birth_date CHECK (birth_date < GETDATE()),
    CONSTRAINT CK_users_login_attempts CHECK (login_attempts >= 0 AND login_attempts <= 10)
);

-- Product categories table
CREATE TABLE product_categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    state_id INT NOT NULL,
    category_name NVARCHAR(100) NOT NULL,
    category_description NVARCHAR(500) NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_product_categories_name CHECK (LEN(TRIM(category_name)) > 0)
);

-- Products table
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    state_id INT NOT NULL,
    product_name NVARCHAR(100) NOT NULL,
    brand NVARCHAR(50) NOT NULL,
    product_code NVARCHAR(50) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    description NVARCHAR(1000) NULL,
    image_url NVARCHAR(500) NULL,
    weight DECIMAL(8,2) NULL,
    dimensions NVARCHAR(100) NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_products_price CHECK (unit_price > 0),
    CONSTRAINT CK_products_stock CHECK (stock_quantity >= 0),
    CONSTRAINT CK_products_name CHECK (LEN(TRIM(product_name)) > 0),
    CONSTRAINT CK_products_code CHECK (LEN(TRIM(product_code)) > 0)
);

-- Orders table
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    client_id INT NOT NULL,
    state_id INT NOT NULL,
    order_number AS ('ORD-' + FORMAT(order_id, '000000')) PERSISTED,
    customer_name NVARCHAR(100) NOT NULL,
    delivery_address NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    order_total DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    delivery_date DATETIME2 NULL,
    special_instructions NVARCHAR(500) NULL,
    is_deleted BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_orders_total CHECK (order_total >= 0),
    CONSTRAINT CK_orders_tax CHECK (tax_amount >= 0),
    CONSTRAINT CK_orders_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT CK_orders_delivery_date CHECK (delivery_date > created_at)
);

-- Order details table
CREATE TABLE order_details (
    order_detail_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total AS (quantity * unit_price) PERSISTED,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount AS (quantity * unit_price * discount_percentage / 100) PERSISTED,
    final_total AS (quantity * unit_price - (quantity * unit_price * discount_percentage / 100)) PERSISTED,
    is_deleted BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    
    -- Constraints
    CONSTRAINT CK_order_details_quantity CHECK (quantity > 0),
    CONSTRAINT CK_order_details_price CHECK (unit_price > 0),
    CONSTRAINT CK_order_details_discount CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- ============================================================================
-- 4. FOREIGN KEY RELATIONSHIPS
-- ============================================================================

-- Users relationships
ALTER TABLE users ADD 
    CONSTRAINT FK_users_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT FK_users_state_id FOREIGN KEY (state_id) REFERENCES states(state_id),
    CONSTRAINT FK_users_client_id FOREIGN KEY (client_id) REFERENCES clients(client_id);

-- Product categories relationships
ALTER TABLE product_categories ADD
    CONSTRAINT FK_product_categories_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_product_categories_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);

-- Products relationships
ALTER TABLE products ADD
    CONSTRAINT FK_products_category_id FOREIGN KEY (category_id) REFERENCES product_categories(category_id),
    CONSTRAINT FK_products_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_products_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);

-- Orders relationships
ALTER TABLE orders ADD
    CONSTRAINT FK_orders_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_orders_client_id FOREIGN KEY (client_id) REFERENCES clients(client_id),
    CONSTRAINT FK_orders_state_id FOREIGN KEY (state_id) REFERENCES states(state_id);

-- Order details relationships
ALTER TABLE order_details ADD
    CONSTRAINT FK_order_details_order_id FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_details_product_id FOREIGN KEY (product_id) REFERENCES products(product_id);

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================

-- Users indexes
CREATE NONCLUSTERED INDEX IX_users_email ON users(email) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_users_role_state ON users(role_id, state_id) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_users_client_id ON users(client_id) WHERE is_deleted = 0;

-- Clients indexes
CREATE NONCLUSTERED INDEX IX_clients_email ON clients(email) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_clients_business_name ON clients(business_name) WHERE is_deleted = 0;

-- Products indexes
CREATE NONCLUSTERED INDEX IX_products_category_state ON products(category_id, state_id) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_products_code ON products(product_code) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_products_name ON products(product_name) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_products_stock ON products(stock_quantity) WHERE is_deleted = 0;

-- Orders indexes
CREATE NONCLUSTERED INDEX IX_orders_user_client ON orders(user_id, client_id) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_orders_state ON orders(state_id) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_orders_date ON orders(created_at) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_orders_delivery_date ON orders(delivery_date) WHERE is_deleted = 0;

-- Order details indexes
CREATE NONCLUSTERED INDEX IX_order_details_order ON order_details(order_id) WHERE is_deleted = 0;
CREATE NONCLUSTERED INDEX IX_order_details_product ON order_details(product_id) WHERE is_deleted = 0;

-- Audit indexes
CREATE NONCLUSTERED INDEX IX_audit_log_table_operation ON audit_log(table_name, operation_type);
CREATE NONCLUSTERED INDEX IX_audit_log_date ON audit_log(operation_date);
CREATE NONCLUSTERED INDEX IX_error_log_date ON error_log(error_date);

-- ============================================================================
-- 6. UTILITY AND VALIDATION PROCEDURES
-- ============================================================================

-- Error logging procedure
CREATE OR ALTER PROCEDURE sp_log_error
    @procedure_name NVARCHAR(128),
    @user_id INT = NULL,
    @additional_info NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO error_log (
        error_number, error_severity, error_state, error_procedure,
        error_line, error_message, user_id, additional_info
    )
    VALUES (
        ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), @procedure_name,
        ERROR_LINE(), ERROR_MESSAGE(), @user_id, @additional_info
    );
END;
GO

-- Audit logging procedure
CREATE OR ALTER PROCEDURE sp_log_audit
    @table_name NVARCHAR(128),
    @operation_type CHAR(1),
    @record_id INT,
    @old_values NVARCHAR(MAX) = NULL,
    @new_values NVARCHAR(MAX) = NULL,
    @user_id INT = NULL,
    @ip_address NVARCHAR(45) = NULL,
    @user_agent NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO audit_log (
        table_name, operation_type, record_id, old_values, new_values,
        user_id, ip_address, user_agent
    )
    VALUES (
        @table_name, @operation_type, @record_id, @old_values, @new_values,
        @user_id, @ip_address, @user_agent
    );
END;
GO

-- Email validation function
CREATE OR ALTER FUNCTION fn_validate_email(@email NVARCHAR(100))
RETURNS BIT
AS
BEGIN
    RETURN CASE 
        WHEN @email LIKE '%@%.%' 
        AND @email NOT LIKE '%@%@%'
        AND @email NOT LIKE '%..%'
        AND LEN(@email) > 5
        THEN 1
        ELSE 0
    END;
END;
GO

-- Stock validation procedure
CREATE OR ALTER PROCEDURE sp_validate_stock
    @product_id INT,
    @required_quantity INT,
    @is_valid BIT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @current_stock INT;
    
    SELECT @current_stock = stock_quantity
    FROM products
    WHERE product_id = @product_id AND is_deleted = 0;
    
    SET @is_valid = CASE 
        WHEN @current_stock >= @required_quantity THEN 1
        ELSE 0
    END;
END;
GO

-- Business rules validation for orders
CREATE OR ALTER PROCEDURE sp_validate_order_business_rules
    @user_id INT,
    @client_id INT,
    @delivery_date DATETIME2,
    @is_valid BIT OUTPUT,
    @error_message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    SET @is_valid = 1;
    SET @error_message = '';
    
    -- Validate user exists and is active
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = @user_id AND is_deleted = 0)
    BEGIN
        SET @is_valid = 0;
        SET @error_message = 'Usuario no válido o inactivo';
        RETURN;
    END;
    
    -- Validate client exists and is active
    IF NOT EXISTS (SELECT 1 FROM clients WHERE client_id = @client_id AND is_deleted = 0)
    BEGIN
        SET @is_valid = 0;
        SET @error_message = 'Cliente no válido o inactivo';
        RETURN;
    END;
    
    -- Validate delivery date
    IF @delivery_date <= GETDATE()
    BEGIN
        SET @is_valid = 0;
        SET @error_message = 'La fecha de entrega debe ser posterior a la fecha actual';
        RETURN;
    END;
END;
GO

-- ============================================================================
-- 7. BUSINESS LOGIC PROCEDURES - CLIENTS
-- ============================================================================

-- Create client procedure
CREATE OR ALTER PROCEDURE sp_create_client
    @business_name NVARCHAR(100),
    @commercial_name NVARCHAR(100) = NULL,
    @delivery_address NVARCHAR(255),
    @phone NVARCHAR(20),
    @email NVARCHAR(100),
    @tax_id NVARCHAR(20) = NULL,
    @user_id INT = NULL,
    @result_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validation
        IF dbo.fn_validate_email(@email) = 0
        BEGIN
            RAISERROR('Email format is invalid', 16, 1);
            RETURN;
        END;
        
        IF EXISTS (SELECT 1 FROM clients WHERE email = @email AND is_deleted = 0)
        BEGIN
            RAISERROR('Email already exists', 16, 1);
            RETURN;
        END;
        
        -- Insert client
        INSERT INTO clients (business_name, commercial_name, delivery_address, phone, email, tax_id)
        VALUES (@business_name, @commercial_name, @delivery_address, @phone, @email, @tax_id);
        
        SET @result_id = SCOPE_IDENTITY();
        
        -- Audit log
        EXEC sp_log_audit 
            @table_name = 'clients',
            @operation_type = 'I',
            @record_id = @result_id,
            @new_values = NULL,
            @user_id = @user_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_create_client', @user_id;
        THROW;
    END CATCH;
END;
GO

-- Update client procedure
CREATE OR ALTER PROCEDURE sp_update_client
    @client_id INT,
    @business_name NVARCHAR(100) = NULL,
    @commercial_name NVARCHAR(100) = NULL,
    @delivery_address NVARCHAR(255) = NULL,
    @phone NVARCHAR(20) = NULL,
    @email NVARCHAR(100) = NULL,
    @tax_id NVARCHAR(20) = NULL,
    @user_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate client exists
        IF NOT EXISTS (SELECT 1 FROM clients WHERE client_id = @client_id AND is_deleted = 0)
        BEGIN
            RAISERROR('Client not found', 16, 1);
            RETURN;
        END;
        
        -- Validate email if provided
        IF @email IS NOT NULL AND dbo.fn_validate_email(@email) = 0
        BEGIN
            RAISERROR('Email format is invalid', 16, 1);
            RETURN;
        END;
        
        -- Check email uniqueness if provided
        IF @email IS NOT NULL AND EXISTS (
            SELECT 1 FROM clients 
            WHERE email = @email AND client_id != @client_id AND is_deleted = 0
        )
        BEGIN
            RAISERROR('Email already exists', 16, 1);
            RETURN;
        END;
        
        -- Update client
        UPDATE clients
        SET business_name = COALESCE(@business_name, business_name),
            commercial_name = COALESCE(@commercial_name, commercial_name),
            delivery_address = COALESCE(@delivery_address, delivery_address),
            phone = COALESCE(@phone, phone),
            email = COALESCE(@email, email),
            tax_id = COALESCE(@tax_id, tax_id),
            updated_at = GETDATE()
        WHERE client_id = @client_id;
        
        -- Audit log
        EXEC sp_log_audit 
            @table_name = 'clients',
            @operation_type = 'U',
            @record_id = @client_id,
            @user_id = @user_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_update_client', @user_id;
        THROW;
    END CATCH;
END;
GO

-- Soft delete client procedure
CREATE OR ALTER PROCEDURE sp_delete_client
    @client_id INT,
    @user_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate client exists
        IF NOT EXISTS (SELECT 1 FROM clients WHERE client_id = @client_id AND is_deleted = 0)
        BEGIN
            RAISERROR('Client not found', 16, 1);
            RETURN;
        END;
        
        -- Check if client has active orders
        IF EXISTS (SELECT 1 FROM orders WHERE client_id = @client_id AND is_deleted = 0)
        BEGIN
            RAISERROR('Cannot delete client with active orders', 16, 1);
            RETURN;
        END;
        
        -- Soft delete client
        UPDATE clients
        SET is_deleted = 1,
            updated_at = GETDATE()
        WHERE client_id = @client_id;
        
        -- Audit log
        EXEC sp_log_audit 
            @table_name = 'clients',
            @operation_type = 'D',
            @record_id = @client_id,
            @user_id = @user_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_delete_client', @user_id;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 8. BUSINESS LOGIC PROCEDURES - PRODUCTS
-- ============================================================================

-- Create product procedure
CREATE OR ALTER PROCEDURE sp_create_product
    @category_id INT,
    @user_id INT,
    @state_id INT,
    @product_name NVARCHAR(100),
    @brand NVARCHAR(50),
    @product_code NVARCHAR(50),
    @stock_quantity INT,
    @unit_price DECIMAL(10,2),
    @description NVARCHAR(1000) = NULL,
    @image_url NVARCHAR(500) = NULL,
    @weight DECIMAL(8,2) = NULL,
    @dimensions NVARCHAR(100) = NULL,
    @audit_user_id INT = NULL,
    @result_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validations
        IF NOT EXISTS (SELECT 1 FROM product_categories WHERE category_id = @category_id AND is_deleted = 0)
        BEGIN
            RAISERROR('Product category not found', 16, 1);
            RETURN;
        END;
        
        IF EXISTS (SELECT 1 FROM products WHERE product_code = @product_code AND is_deleted = 0)
        BEGIN
            RAISERROR('Product code already exists', 16, 1);
            RETURN;
        END;
        
        -- Insert product
        INSERT INTO products (
            category_id, user_id, state_id, product_name, brand, product_code,
            stock_quantity, unit_price, description, image_url, weight, dimensions
        )
        VALUES (
            @category_id, @user_id, @state_id, @product_name, @brand, @product_code,
            @stock_quantity, @unit_price, @description, @image_url, @weight, @dimensions
        );
        
        SET @result_id = SCOPE_IDENTITY();
        
        -- Audit log
        EXEC sp_log_audit 
            @table_name = 'products',
            @operation_type = 'I',
            @record_id = @result_id,
            @user_id = @audit_user_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_create_product', @audit_user_id;
        THROW;
    END CATCH;
END;
GO

-- Update product stock procedure
CREATE OR ALTER PROCEDURE sp_update_product_stock
    @product_id INT,
    @quantity_change INT, -- Positive for increase, negative for decrease
    @operation_type NVARCHAR(20), -- 'SALE', 'RETURN', 'ADJUSTMENT', 'RESTOCK'
    @user_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @current_stock INT, @new_stock INT;
        
        -- Get current stock
        SELECT @current_stock = stock_quantity
        FROM products
        WHERE product_id = @product_id AND is_deleted = 0;
        
        IF @current_stock IS NULL
        BEGIN
            RAISERROR('Product not found', 16, 1);
            RETURN;
        END;
        
        SET @new_stock = @current_stock + @quantity_change;
        
        -- Validate new stock is not negative
        IF @new_stock < 0
        BEGIN
            RAISERROR('Insufficient stock. Current stock: %d, Required: %d', 16, 1, @current_stock, ABS(@quantity_change));
            RETURN;
        END;
        
        -- Update stock
        UPDATE products
        SET stock_quantity = @new_stock,
            updated_at = GETDATE()
        WHERE product_id = @product_id;
        
        -- Audit log with details
        DECLARE @audit_details NVARCHAR(MAX) = FORMATMESSAGE(
            'Stock %s: %d -> %d (Change: %d) - Operation: %s',
            CASE WHEN @quantity_change > 0 THEN 'Increase' ELSE 'Decrease' END,
            @current_stock, @new_stock, @quantity_change, @operation_type
        );
        
        EXEC sp_log_audit 
            @table_name = 'products',
            @operation_type = 'U',
            @record_id = @product_id,
            @new_values = @audit_details,
            @user_id = @user_id;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_update_product_stock', @user_id;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 9. BUSINESS LOGIC PROCEDURES - ORDERS
-- ============================================================================

-- Create order with details procedure (improved with JSON support)
CREATE OR ALTER PROCEDURE sp_create_order_with_details
    @user_id INT,
    @client_id INT,
    @state_id INT,
    @customer_name NVARCHAR(100),
    @delivery_address NVARCHAR(255),
    @phone NVARCHAR(20),
    @email NVARCHAR(100),
    @delivery_date DATETIME2,
    @special_instructions NVARCHAR(500) = NULL,
    @order_details_json NVARCHAR(MAX), -- JSON array with order details
    @audit_user_id INT = NULL,
    @result_order_id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Business rules validation
        DECLARE @is_valid BIT, @error_message NVARCHAR(500);
        EXEC sp_validate_order_business_rules @user_id, @client_id, @delivery_date, @is_valid OUTPUT, @error_message OUTPUT;
        
        IF @is_valid = 0
        BEGIN
            RAISERROR(@error_message, 16, 1);
            RETURN;
        END;
        
        -- Validate email
        IF dbo.fn_validate_email(@email) = 0
        BEGIN
            RAISERROR('Invalid email format', 16, 1);
            RETURN;
        END;
        
        -- Parse and validate order details
        IF NOT ISJSON(@order_details_json)
        BEGIN
            RAISERROR('Invalid JSON format for order details', 16, 1);
            RETURN;
        END;
        
        -- Create temporary table for order details
        CREATE TABLE #order_details_temp (
            product_id INT,
            quantity INT,
            unit_price DECIMAL(10,2),
            discount_percentage DECIMAL(5,2) DEFAULT 0
        );
        
        -- Parse JSON into temp table
        INSERT INTO #order_details_temp (product_id, quantity, unit_price, discount_percentage)
        SELECT 
            JSON_VALUE(value, '$.product_id'),
            JSON_VALUE(value, '$.quantity'),
            JSON_VALUE(value, '$.unit_price'),
            ISNULL(JSON_VALUE(value, '$.discount_percentage'), 0)
        FROM OPENJSON(@order_details_json);
        
        -- Validate all products exist and have sufficient stock
        DECLARE @invalid_products NVARCHAR(MAX) = '';
        
        SELECT @invalid_products = @invalid_products + 
               CASE 
                   WHEN p.product_id IS NULL THEN 'Product ID ' + CAST(t.product_id AS NVARCHAR) + ' not found; '
                   WHEN p.stock_quantity < t.quantity THEN 'Insufficient stock for product ' + p.product_name + ' (Available: ' + CAST(p.stock_quantity AS NVARCHAR) + ', Required: ' + CAST(t.quantity AS NVARCHAR) + '); '
                   ELSE ''
               END
        FROM #order_details_temp t
        LEFT JOIN products p ON t.product_id = p.product_id AND p.is_deleted = 0;
        
        IF LEN(@invalid_products) > 0
        BEGIN
            RAISERROR('Order validation failed: %s', 16, 1, @invalid_products);
            RETURN;
        END;
        
        -- Create order
        INSERT INTO orders (
            user_id, client_id, state_id, customer_name, delivery_address,
            phone, email, delivery_date, special_instructions
        )
        VALUES (
            @user_id, @client_id, @state_id, @customer_name, @delivery_address,
            @phone, @email, @delivery_date, @special_instructions
        );
        
        SET @result_order_id = SCOPE_IDENTITY();
        
        -- Insert order details and update stock
        INSERT INTO order_details (order_id, product_id, quantity, unit_price, discount_percentage)
        SELECT @result_order_id, product_id, quantity, unit_price, discount_percentage
        FROM #order_details_temp;
        
        -- Update product stock
        DECLARE @product_id INT, @quantity INT;
        DECLARE stock_cursor CURSOR FOR
        SELECT product_id, quantity FROM #order_details_temp;
        
        OPEN stock_cursor;
        FETCH NEXT FROM stock_cursor INTO @product_id, @quantity;
        
        WHILE @@FETCH_STATUS = 0
        BEGIN
            EXEC sp_update_product_stock @product_id, @quantity * -1, 'SALE', @audit_user_id;
            FETCH NEXT FROM stock_cursor INTO @product_id, @quantity;
        END;
        
        CLOSE stock_cursor;
        DEALLOCATE stock_cursor;
        
        -- Calculate and update order total
        DECLARE @order_total DECIMAL(12,2), @tax_amount DECIMAL(10,2);
        
        SELECT @order_total = SUM(final_total)
        FROM order_details
        WHERE order_id = @result_order_id;
        
        SET @tax_amount = @order_total * 0.12; -- 12% tax
        
        UPDATE orders
        SET order_total = @order_total,
            tax_amount = @tax_amount
        WHERE order_id = @result_order_id;
        
        -- Audit log
        EXEC sp_log_audit 
            @table_name = 'orders',
            @operation_type = 'I',
            @record_id = @result_order_id,
            @user_id = @audit_user_id;
        
        DROP TABLE #order_details_temp;
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF OBJECT_ID('tempdb..#order_details_temp') IS NOT NULL
            DROP TABLE #order_details_temp;
            
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_create_order_with_details', @audit_user_id;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- 10. AUDIT TRIGGERS
-- ============================================================================

-- Trigger for products table
CREATE OR ALTER TRIGGER tr_products_audit
ON products
AFTER UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Handle updates
    IF EXISTS (SELECT 1 FROM inserted)
    BEGIN
        INSERT INTO audit_log (table_name, operation_type, record_id, old_values, new_values)
        SELECT 
            'products',
            'U',
            i.product_id,
            (SELECT d.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
            (SELECT i.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM inserted i
        INNER JOIN deleted d ON i.product_id = d.product_id;
    END;
    
    -- Handle deletes (should not happen with soft delete, but just in case)
    IF NOT EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)
    BEGIN
        INSERT INTO audit_log (table_name, operation_type, record_id, old_values)
        SELECT 
            'products',
            'D',
            d.product_id,
            (SELECT d.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM deleted d;
    END;
END;
GO

-- Trigger for automatic category state propagation
CREATE OR ALTER TRIGGER tr_category_state_propagation
ON product_categories
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    IF UPDATE(state_id)
    BEGIN
        -- When category is deactivated, deactivate all its products
        UPDATE p
        SET state_id = i.state_id,
            updated_at = GETDATE()
        FROM products p
        INNER JOIN inserted i ON p.category_id = i.category_id
        INNER JOIN deleted d ON i.category_id = d.category_id
        WHERE i.state_id != d.state_id AND i.state_id = 2; -- Assuming 2 = Inactive
    END;
END;
GO

-- ============================================================================
-- 11. BUSINESS VIEWS
-- ============================================================================

-- Active products with stock view
CREATE OR ALTER VIEW vw_active_products_with_stock
AS
SELECT 
    p.product_id,
    p.product_name,
    p.brand,
    p.product_code,
    p.stock_quantity,
    p.unit_price,
    pc.category_name,
    s.state_name,
    p.created_at,
    p.updated_at
FROM products p
INNER JOIN product_categories pc ON p.category_id = pc.category_id
INNER JOIN states s ON p.state_id = s.state_id
WHERE p.is_deleted = 0 
  AND p.stock_quantity > 0 
  AND s.state_name = 'Active'
  AND pc.is_deleted = 0;
GO

-- Monthly sales summary view
CREATE OR ALTER VIEW vw_monthly_sales_summary
AS
SELECT 
    YEAR(o.created_at) AS sales_year,
    MONTH(o.created_at) AS sales_month,
    DATENAME(MONTH, o.created_at) AS month_name,
    COUNT(DISTINCT o.order_id) AS total_orders,
    COUNT(DISTINCT o.client_id) AS unique_clients,
    SUM(o.order_total) AS total_sales,
    SUM(o.tax_amount) AS total_tax,
    AVG(o.order_total) AS average_order_value
FROM orders o
WHERE o.is_deleted = 0
GROUP BY YEAR(o.created_at), MONTH(o.created_at), DATENAME(MONTH, o.created_at);
GO

-- Top clients by consumption view
CREATE OR ALTER VIEW vw_top_clients_by_consumption
AS
SELECT TOP 100
    c.client_id,
    c.business_name,
    c.commercial_name,
    c.email,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(o.order_total) AS total_consumption,
    AVG(o.order_total) AS average_order_value,
    MAX(o.created_at) AS last_order_date
FROM clients c
INNER JOIN orders o ON c.client_id = o.client_id
WHERE c.is_deleted = 0 AND o.is_deleted = 0
GROUP BY c.client_id, c.business_name, c.commercial_name, c.email
ORDER BY total_consumption DESC;
GO

-- Top selling products view
CREATE OR ALTER VIEW vw_top_selling_products
AS
SELECT TOP 100
    p.product_id,
    p.product_name,
    p.brand,
    p.product_code,
    pc.category_name,
    SUM(od.quantity) AS total_quantity_sold,
    SUM(od.final_total) AS total_revenue,
    COUNT(DISTINCT od.order_id) AS orders_count,
    AVG(od.unit_price) AS average_selling_price
FROM products p
INNER JOIN order_details od ON p.product_id = od.product_id
INNER JOIN orders o ON od.order_id = o.order_id
INNER JOIN product_categories pc ON p.category_id = pc.category_id
WHERE p.is_deleted = 0 AND od.is_deleted = 0 AND o.is_deleted = 0
GROUP BY p.product_id, p.product_name, p.brand, p.product_code, pc.category_name
ORDER BY total_quantity_sold DESC;
GO

-- ============================================================================
-- 12. INITIAL DATA INSERTION
-- ============================================================================

-- Insert states
INSERT INTO states (state_name, state_description) VALUES
('Active', 'Entity is active and operational'),
('Inactive', 'Entity is inactive but not deleted'),
('Pending', 'Entity is pending approval'),
('Approved', 'Entity has been approved'),
('Rejected', 'Entity has been rejected'),
('Cancelled', 'Entity has been cancelled'),
('Completed', 'Entity process is completed'),
('In Progress', 'Entity is currently being processed');

-- Insert roles
INSERT INTO roles (role_name, role_description) VALUES
('Administrator', 'Full system access and management'),
('Manager', 'Management level access'),
('Employee', 'Standard employee access'),
('Client', 'Client access level');

-- Insert sample clients
DECLARE @client_result_id INT;

EXEC sp_create_client 
    @business_name = 'Tech Solutions Guatemala', 
    @commercial_name = 'TechSolutions', 
    @delivery_address = 'Zona 10, Guatemala City', 
    @phone = '2234-5678', 
    @email = 'contact@techsolutions.gt',
    @tax_id = 'CF-123456-7',
    @result_id = @client_result_id OUTPUT;

EXEC sp_create_client 
    @business_name = 'Innovación Digital S.A.', 
    @commercial_name = 'InnovaDigital', 
    @delivery_address = 'Zona 1, Guatemala City', 
    @phone = '2345-6789', 
    @email = 'info@innovadigital.com',
    @tax_id = 'CF-987654-3',
    @result_id = @client_result_id OUTPUT;

-- Insert sample product categories
INSERT INTO product_categories (user_id, state_id, category_name, category_description) VALUES
(1, 1, 'Electronics', 'Electronic devices and components'),
(1, 1, 'Computers', 'Desktop and laptop computers'),
(1, 1, 'Mobile Devices', 'Smartphones and tablets'),
(1, 1, 'Accessories', 'Computer and mobile accessories'),
(1, 1, 'Software', 'Software licenses and applications');

-- Note: Users need to be created before products can be inserted
-- This would typically be done through the application layer with proper password hashing

PRINT 'Database structure created successfully with all improvements implemented!';
PRINT 'Next steps:';
PRINT '1. Create users through the application with proper password hashing';
PRINT '2. Insert products using the sp_create_product procedure';
PRINT '3. Test the order creation with sp_create_order_with_details';
PRINT '4. Review audit logs in audit_log table';
PRINT '5. Monitor performance using the created indexes';

-- ============================================================================
-- END OF IMPROVED DATABASE SCRIPT
-- ============================================================================

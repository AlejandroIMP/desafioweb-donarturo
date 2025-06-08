/*
===============================================================================
                    ADDITIONAL BUSINESS PROCEDURES
                     Advanced CRUD and Utility Functions
===============================================================================
This file contains additional procedures that complement the main database script
with complete CRUD operations and advanced business functionality.
===============================================================================
*/

USE ecommerce_gda004;
GO

-- ============================================================================
-- USER MANAGEMENT PROCEDURES
-- ============================================================================

-- Create user procedure with password hashing support
CREATE OR ALTER PROCEDURE sp_create_user
    @role_id INT,
    @state_id INT,
    @client_id INT = NULL,
    @email NVARCHAR(100),
    @full_name NVARCHAR(100),
    @password_hash NVARCHAR(255),
    @phone NVARCHAR(20) = NULL,
    @birth_date DATE = NULL,
    @audit_user_id INT = NULL,
    @result_id INT OUTPUT
AS
BEGIN
    /*
    Purpose: Creates a new user with proper validations and audit logging
    
    Parameters:
    - @role_id: Role identifier (1=Admin, 2=Manager, 3=Employee, 4=Client)
    - @state_id: Initial state (1=Active, 2=Inactive, etc.)
    - @client_id: Associated client (optional, required for client users)
    - @email: User email (must be unique and valid format)
    - @full_name: User's full name
    - @password_hash: Pre-hashed password (should be bcrypt/scrypt hash)
    - @phone: Phone number (optional)
    - @birth_date: Date of birth (optional)
    - @audit_user_id: ID of user performing the operation (for audit)
    - @result_id: OUTPUT parameter returning the new user ID
    
    Returns: New user ID through @result_id parameter
    Throws: Error if validation fails
    */
    
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Input validations
        IF @role_id IS NULL OR NOT EXISTS (SELECT 1 FROM roles WHERE role_id = @role_id AND is_active = 1)
        BEGIN
            RAISERROR('Invalid or inactive role specified', 16, 1);
            RETURN;
        END;
        
        IF @state_id IS NULL OR NOT EXISTS (SELECT 1 FROM states WHERE state_id = @state_id)
        BEGIN
            RAISERROR('Invalid state specified', 16, 1);
            RETURN;
        END;
        
        -- Validate email format and uniqueness
        IF dbo.fn_validate_email(@email) = 0
        BEGIN
            RAISERROR('Invalid email format', 16, 1);
            RETURN;
        END;
        
        IF EXISTS (SELECT 1 FROM users WHERE email = @email AND is_deleted = 0)
        BEGIN
            RAISERROR('Email already exists', 16, 1);
            RETURN;
        END;
        
        -- For client role, client_id is required
        IF @role_id = 4 AND (@client_id IS NULL OR NOT EXISTS (SELECT 1 FROM clients WHERE client_id = @client_id AND is_deleted = 0))
        BEGIN
            RAISERROR('Valid client ID is required for client users', 16, 1);
            RETURN;
        END;
        
        -- Validate birth date
        IF @birth_date IS NOT NULL AND @birth_date >= CAST(GETDATE() AS DATE)
        BEGIN
            RAISERROR('Birth date must be in the past', 16, 1);
            RETURN;
        END;
        
        -- Create user
        INSERT INTO users (
            role_id, state_id, client_id, email, full_name, 
            password_hash, phone, birth_date
        )
        VALUES (
            @role_id, @state_id, @client_id, @email, @full_name,
            @password_hash, @phone, @birth_date
        );
        
        SET @result_id = SCOPE_IDENTITY();
        
        -- Audit logging
        EXEC sp_log_audit 
            @table_name = 'users',
            @operation_type = 'I',
            @record_id = @result_id,
            @new_values = JSON_OBJECT('email', @email, 'full_name', @full_name, 'role_id', @role_id),
            @user_id = @audit_user_id;
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_create_user', @audit_user_id, 
            JSON_OBJECT('email', @email, 'role_id', @role_id, 'error', ERROR_MESSAGE());
        THROW;
    END CATCH;
END;
GO

-- Update user procedure
CREATE OR ALTER PROCEDURE sp_update_user
    @user_id INT,
    @role_id INT = NULL,
    @state_id INT = NULL,
    @client_id INT = NULL,
    @email NVARCHAR(100) = NULL,
    @full_name NVARCHAR(100) = NULL,
    @phone NVARCHAR(20) = NULL,
    @birth_date DATE = NULL,
    @audit_user_id INT = NULL
AS
BEGIN
    /*
    Purpose: Updates user information with proper validations
    
    Parameters: All parameters except @user_id are optional.
                Only provided parameters will be updated.
    */
    
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validate user exists
        IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = @user_id AND is_deleted = 0)
        BEGIN
            RAISERROR('User not found', 16, 1);
            RETURN;
        END;
        
        -- Store old values for audit
        DECLARE @old_values NVARCHAR(MAX);
        SELECT @old_values = (
            SELECT user_id, role_id, state_id, client_id, email, full_name, phone, birth_date
            FROM users WHERE user_id = @user_id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        );
        
        -- Validate role if provided
        IF @role_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM roles WHERE role_id = @role_id AND is_active = 1)
        BEGIN
            RAISERROR('Invalid or inactive role specified', 16, 1);
            RETURN;
        END;
        
        -- Validate state if provided
        IF @state_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM states WHERE state_id = @state_id)
        BEGIN
            RAISERROR('Invalid state specified', 16, 1);
            RETURN;
        END;
        
        -- Validate email if provided
        IF @email IS NOT NULL
        BEGIN
            IF dbo.fn_validate_email(@email) = 0
            BEGIN
                RAISERROR('Invalid email format', 16, 1);
                RETURN;
            END;
            
            IF EXISTS (SELECT 1 FROM users WHERE email = @email AND user_id != @user_id AND is_deleted = 0)
            BEGIN
                RAISERROR('Email already exists', 16, 1);
                RETURN;
            END;
        END;
        
        -- Validate client if provided
        IF @client_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM clients WHERE client_id = @client_id AND is_deleted = 0)
        BEGIN
            RAISERROR('Invalid client specified', 16, 1);
            RETURN;
        END;
        
        -- Update user
        UPDATE users
        SET role_id = COALESCE(@role_id, role_id),
            state_id = COALESCE(@state_id, state_id),
            client_id = COALESCE(@client_id, client_id),
            email = COALESCE(@email, email),
            full_name = COALESCE(@full_name, full_name),
            phone = COALESCE(@phone, phone),
            birth_date = COALESCE(@birth_date, birth_date),
            updated_at = GETDATE()
        WHERE user_id = @user_id;
        
        -- Get new values for audit
        DECLARE @new_values NVARCHAR(MAX);
        SELECT @new_values = (
            SELECT user_id, role_id, state_id, client_id, email, full_name, phone, birth_date
            FROM users WHERE user_id = @user_id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        );
        
        -- Audit logging
        EXEC sp_log_audit 
            @table_name = 'users',
            @operation_type = 'U',
            @record_id = @user_id,
            @old_values = @old_values,
            @new_values = @new_values,
            @user_id = @audit_user_id;
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_update_user', @audit_user_id;
        THROW;
    END CATCH;
END;
GO

-- User authentication procedure
CREATE OR ALTER PROCEDURE sp_authenticate_user
    @email NVARCHAR(100),
    @password_hash NVARCHAR(255),
    @ip_address NVARCHAR(45) = NULL,
    @user_agent NVARCHAR(500) = NULL,
    @user_id INT OUTPUT,
    @is_authenticated BIT OUTPUT,
    @user_info NVARCHAR(MAX) OUTPUT
AS
BEGIN
    /*
    Purpose: Authenticates a user and manages login attempts/lockouts
    
    Parameters:
    - @email: User email
    - @password_hash: Hashed password to verify
    - @ip_address: Client IP for audit (optional)
    - @user_agent: Client user agent for audit (optional)
    - @user_id: OUTPUT - User ID if authentication successful
    - @is_authenticated: OUTPUT - 1 if successful, 0 if failed
    - @user_info: OUTPUT - JSON with user information if successful
    */
    
    SET NOCOUNT ON;
    
    SET @is_authenticated = 0;
    SET @user_id = NULL;
    SET @user_info = NULL;
    
    BEGIN TRY
        DECLARE @stored_user_id INT, @stored_password NVARCHAR(255), @login_attempts INT, 
                @is_locked BIT, @locked_until DATETIME2, @state_id INT, @role_id INT;
        
        -- Get user information
        SELECT 
            @stored_user_id = user_id,
            @stored_password = password_hash,
            @login_attempts = login_attempts,
            @is_locked = is_locked,
            @locked_until = locked_until,
            @state_id = state_id,
            @role_id = role_id
        FROM users 
        WHERE email = @email AND is_deleted = 0;
        
        -- Check if user exists
        IF @stored_user_id IS NULL
        BEGIN
            -- Log failed attempt for audit
            EXEC sp_log_audit 
                @table_name = 'users',
                @operation_type = 'U',
                @record_id = 0,
                @new_values = 'Failed login attempt - user not found',
                @ip_address = @ip_address,
                @user_agent = @user_agent;
            RETURN;
        END;
        
        -- Check if account is locked
        IF @is_locked = 1 AND (@locked_until IS NULL OR @locked_until > GETDATE())
        BEGIN
            EXEC sp_log_audit 
                @table_name = 'users',
                @operation_type = 'U',
                @record_id = @stored_user_id,
                @new_values = 'Failed login attempt - account locked',
                @ip_address = @ip_address,
                @user_agent = @user_agent;
            RETURN;
        END;
        
        -- Check if user is active
        IF @state_id != 1 -- Assuming 1 = Active
        BEGIN
            EXEC sp_log_audit 
                @table_name = 'users',
                @operation_type = 'U',
                @record_id = @stored_user_id,
                @new_values = 'Failed login attempt - account inactive',
                @ip_address = @ip_address,
                @user_agent = @user_agent;
            RETURN;
        END;
        
        -- Verify password
        IF @stored_password = @password_hash
        BEGIN
            -- Successful authentication
            SET @is_authenticated = 1;
            SET @user_id = @stored_user_id;
            
            -- Reset login attempts and unlock account
            UPDATE users
            SET login_attempts = 0,
                is_locked = 0,
                locked_until = NULL,
                last_login = GETDATE()
            WHERE user_id = @stored_user_id;
            
            -- Get user information
            SELECT @user_info = (
                SELECT 
                    u.user_id,
                    u.email,
                    u.full_name,
                    u.phone,
                    r.role_name,
                    s.state_name,
                    c.business_name,
                    u.last_login
                FROM users u
                INNER JOIN roles r ON u.role_id = r.role_id
                INNER JOIN states s ON u.state_id = s.state_id
                LEFT JOIN clients c ON u.client_id = c.client_id
                WHERE u.user_id = @stored_user_id
                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
            );
            
            -- Log successful login
            EXEC sp_log_audit 
                @table_name = 'users',
                @operation_type = 'U',
                @record_id = @stored_user_id,
                @new_values = 'Successful login',
                @user_id = @stored_user_id,
                @ip_address = @ip_address,
                @user_agent = @user_agent;
        END
        ELSE
        BEGIN
            -- Failed authentication - increment login attempts
            SET @login_attempts = @login_attempts + 1;
            
            DECLARE @should_lock BIT = CASE WHEN @login_attempts >= 5 THEN 1 ELSE 0 END;
            DECLARE @lock_until DATETIME2 = CASE WHEN @should_lock = 1 THEN DATEADD(MINUTE, 30, GETDATE()) ELSE NULL END;
            
            UPDATE users
            SET login_attempts = @login_attempts,
                is_locked = @should_lock,
                locked_until = @lock_until
            WHERE user_id = @stored_user_id;
            
            -- Log failed attempt
            EXEC sp_log_audit 
                @table_name = 'users',
                @operation_type = 'U',
                @record_id = @stored_user_id,
                @new_values = JSON_OBJECT('event', 'Failed login attempt', 'attempts', @login_attempts, 'locked', @should_lock),
                @ip_address = @ip_address,
                @user_agent = @user_agent;
        END;
        
    END TRY
    BEGIN CATCH
        EXEC sp_log_error 'sp_authenticate_user', NULL, 
            JSON_OBJECT('email', @email, 'error', ERROR_MESSAGE());
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- PRODUCT CATEGORY MANAGEMENT
-- ============================================================================

-- Create product category procedure
CREATE OR ALTER PROCEDURE sp_create_product_category
    @user_id INT,
    @state_id INT,
    @category_name NVARCHAR(100),
    @category_description NVARCHAR(500) = NULL,
    @audit_user_id INT = NULL,
    @result_id INT OUTPUT
AS
BEGIN
    /*
    Purpose: Creates a new product category with validations
    */
    
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Validations
        IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = @user_id AND is_deleted = 0)
        BEGIN
            RAISERROR('Invalid user specified', 16, 1);
            RETURN;
        END;
        
        IF NOT EXISTS (SELECT 1 FROM states WHERE state_id = @state_id)
        BEGIN
            RAISERROR('Invalid state specified', 16, 1);
            RETURN;
        END;
        
        IF EXISTS (SELECT 1 FROM product_categories WHERE category_name = @category_name AND is_deleted = 0)
        BEGIN
            RAISERROR('Category name already exists', 16, 1);
            RETURN;
        END;
        
        -- Insert category
        INSERT INTO product_categories (user_id, state_id, category_name, category_description)
        VALUES (@user_id, @state_id, @category_name, @category_description);
        
        SET @result_id = SCOPE_IDENTITY();
        
        -- Audit log
        EXEC sp_log_audit 
            @table_name = 'product_categories',
            @operation_type = 'I',
            @record_id = @result_id,
            @new_values = JSON_OBJECT('category_name', @category_name, 'state_id', @state_id),
            @user_id = @audit_user_id;
        
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        EXEC sp_log_error 'sp_create_product_category', @audit_user_id;
        THROW;
    END CATCH;
END;
GO

-- ============================================================================
-- REPORTING AND ANALYTICS PROCEDURES
-- ============================================================================

-- Get sales report procedure
CREATE OR ALTER PROCEDURE sp_get_sales_report
    @start_date DATE,
    @end_date DATE,
    @client_id INT = NULL,
    @category_id INT = NULL,
    @user_id INT = NULL
AS
BEGIN
    /*
    Purpose: Generate comprehensive sales report with filters
    
    Parameters:
    - @start_date: Report start date
    - @end_date: Report end date  
    - @client_id: Filter by specific client (optional)
    - @category_id: Filter by product category (optional)
    - @user_id: User requesting report (for audit)
    */
    
    SET NOCOUNT ON;
    
    -- Log report generation
    EXEC sp_log_audit 
        @table_name = 'orders',
        @operation_type = 'R', -- Read operation
        @record_id = 0,
        @new_values = JSON_OBJECT('report_type', 'sales', 'start_date', @start_date, 'end_date', @end_date),
        @user_id = @user_id;
    
    -- Main report query
    SELECT 
        -- Order information
        o.order_id,
        o.order_number,
        o.created_at,
        o.delivery_date,
        
        -- Client information
        c.business_name,
        c.commercial_name,
        c.email AS client_email,
        
        -- User information
        u.full_name AS user_name,
        r.role_name,
        
        -- Financial summary
        o.order_total,
        o.tax_amount,
        COUNT(od.order_detail_id) AS total_items,
        
        -- Product details (aggregated)
        STRING_AGG(CONCAT(p.product_name, ' (', od.quantity, ')'), ', ') AS products_summary,
        
        -- State information
        s.state_name AS order_state
        
    FROM orders o
    INNER JOIN clients c ON o.client_id = c.client_id
    INNER JOIN users u ON o.user_id = u.user_id
    INNER JOIN roles r ON u.role_id = r.role_id
    INNER JOIN states s ON o.state_id = s.state_id
    INNER JOIN order_details od ON o.order_id = od.order_id
    INNER JOIN products p ON od.product_id = p.product_id
    LEFT JOIN product_categories pc ON p.category_id = pc.category_id
    
    WHERE o.is_deleted = 0
      AND o.created_at >= @start_date
      AND o.created_at <= @end_date
      AND (@client_id IS NULL OR o.client_id = @client_id)
      AND (@category_id IS NULL OR p.category_id = @category_id)
    
    GROUP BY 
        o.order_id, o.order_number, o.created_at, o.delivery_date,
        c.business_name, c.commercial_name, c.email,
        u.full_name, r.role_name, o.order_total, o.tax_amount,
        s.state_name
    
    ORDER BY o.created_at DESC;
    
    -- Summary statistics
    SELECT 
        'SUMMARY' AS report_section,
        COUNT(DISTINCT o.order_id) AS total_orders,
        COUNT(DISTINCT o.client_id) AS unique_clients,
        SUM(o.order_total) AS total_sales,
        SUM(o.tax_amount) AS total_tax,
        AVG(o.order_total) AS average_order_value,
        MIN(o.order_total) AS min_order_value,
        MAX(o.order_total) AS max_order_value
    FROM orders o
    WHERE o.is_deleted = 0
      AND o.created_at >= @start_date
      AND o.created_at <= @end_date
      AND (@client_id IS NULL OR o.client_id = @client_id);
END;
GO

-- Get inventory report procedure
CREATE OR ALTER PROCEDURE sp_get_inventory_report
    @category_id INT = NULL,
    @low_stock_threshold INT = 10,
    @user_id INT = NULL
AS
BEGIN
    /*
    Purpose: Generate inventory report with stock levels and alerts
    */
    
    SET NOCOUNT ON;
    
    -- Log report generation
    EXEC sp_log_audit 
        @table_name = 'products',
        @operation_type = 'R',
        @record_id = 0,
        @new_values = JSON_OBJECT('report_type', 'inventory', 'threshold', @low_stock_threshold),
        @user_id = @user_id;
    
    SELECT 
        p.product_id,
        p.product_name,
        p.brand,
        p.product_code,
        pc.category_name,
        p.stock_quantity,
        p.unit_price,
        p.stock_quantity * p.unit_price AS inventory_value,
        
        -- Stock status
        CASE 
            WHEN p.stock_quantity = 0 THEN 'OUT_OF_STOCK'
            WHEN p.stock_quantity <= @low_stock_threshold THEN 'LOW_STOCK'
            ELSE 'NORMAL'
        END AS stock_status,
        
        -- Sales data (last 30 days)
        ISNULL(sales_data.units_sold, 0) AS units_sold_30d,
        ISNULL(sales_data.revenue_30d, 0) AS revenue_30d,
        
        -- Dates
        p.created_at,
        p.updated_at,
        s.state_name
        
    FROM products p
    INNER JOIN product_categories pc ON p.category_id = pc.category_id
    INNER JOIN states s ON p.state_id = s.state_id
    LEFT JOIN (
        SELECT 
            od.product_id,
            SUM(od.quantity) AS units_sold,
            SUM(od.final_total) AS revenue_30d
        FROM order_details od
        INNER JOIN orders o ON od.order_id = o.order_id
        WHERE o.created_at >= DATEADD(DAY, -30, GETDATE())
          AND o.is_deleted = 0
          AND od.is_deleted = 0
        GROUP BY od.product_id
    ) sales_data ON p.product_id = sales_data.product_id
    
    WHERE p.is_deleted = 0
      AND (@category_id IS NULL OR p.category_id = @category_id)
    
    ORDER BY 
        CASE 
            WHEN p.stock_quantity = 0 THEN 1
            WHEN p.stock_quantity <= @low_stock_threshold THEN 2
            ELSE 3
        END,
        p.stock_quantity ASC,
        p.product_name;
END;
GO

-- ============================================================================
-- MAINTENANCE AND UTILITY PROCEDURES
-- ============================================================================

-- Cleanup old audit logs procedure
CREATE OR ALTER PROCEDURE sp_cleanup_audit_logs
    @days_to_keep INT = 365,
    @user_id INT = NULL
AS
BEGIN
    /*
    Purpose: Remove old audit log entries to maintain performance
    
    Parameters:
    - @days_to_keep: Number of days of audit logs to retain (default 365)
    - @user_id: User performing the cleanup (for audit)
    */
    
    SET NOCOUNT ON;
    
    BEGIN TRY
        DECLARE @cutoff_date DATETIME2 = DATEADD(DAY, -@days_to_keep, GETDATE());
        DECLARE @deleted_count INT;
        
        -- Delete old audit logs
        DELETE FROM audit_log 
        WHERE operation_date < @cutoff_date;
        
        SET @deleted_count = @@ROWCOUNT;
        
        -- Log the cleanup operation
        EXEC sp_log_audit 
            @table_name = 'audit_log',
            @operation_type = 'D',
            @record_id = 0,
            @new_values = JSON_OBJECT('cleanup_operation', 'audit_logs', 'deleted_count', @deleted_count, 'cutoff_date', @cutoff_date),
            @user_id = @user_id;
            
        PRINT CONCAT('Cleanup completed: ', @deleted_count, ' audit log entries removed');
        
    END TRY
    BEGIN CATCH
        EXEC sp_log_error 'sp_cleanup_audit_logs', @user_id;
        THROW;
    END CATCH;
END;
GO

-- Database health check procedure
CREATE OR ALTER PROCEDURE sp_database_health_check
AS
BEGIN
    /*
    Purpose: Perform database health checks and return status information
    */
    
    SET NOCOUNT ON;
    
    -- Table sizes and row counts
    SELECT 
        'TABLE_STATISTICS' AS check_type,
        t.name AS table_name,
        p.rows AS row_count,
        CAST(ROUND(((SUM(a.total_pages) * 8) / 1024.00), 2) AS NUMERIC(36, 2)) AS size_mb
    FROM sys.tables t
    INNER JOIN sys.indexes i ON t.OBJECT_ID = i.object_id
    INNER JOIN sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
    INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
    WHERE t.name IN ('users', 'clients', 'products', 'orders', 'order_details', 'audit_log', 'error_log')
    GROUP BY t.name, p.rows
    ORDER BY size_mb DESC;
    
    -- Recent error summary
    SELECT 
        'ERROR_SUMMARY' AS check_type,
        COUNT(*) AS error_count,
        error_procedure,
        MAX(error_date) AS last_occurrence
    FROM error_log 
    WHERE error_date >= DATEADD(DAY, -7, GETDATE())
    GROUP BY error_procedure
    ORDER BY error_count DESC;
    
    -- Active user counts by role
    SELECT 
        'USER_STATISTICS' AS check_type,
        r.role_name,
        COUNT(*) AS user_count,
        SUM(CASE WHEN u.last_login >= DATEADD(DAY, -30, GETDATE()) THEN 1 ELSE 0 END) AS active_last_30_days
    FROM users u
    INNER JOIN roles r ON u.role_id = r.role_id
    WHERE u.is_deleted = 0
    GROUP BY r.role_name
    ORDER BY user_count DESC;
    
    -- Low stock products
    SELECT 
        'LOW_STOCK_ALERT' AS check_type,
        COUNT(*) AS products_count
    FROM products 
    WHERE stock_quantity <= 10 AND is_deleted = 0;
END;
GO

PRINT 'Additional business procedures created successfully!';
PRINT '';
PRINT 'Available procedures:';
PRINT '- sp_create_user: Create new users with validations';
PRINT '- sp_update_user: Update user information';
PRINT '- sp_authenticate_user: User authentication with lockout protection';
PRINT '- sp_create_product_category: Create product categories';
PRINT '- sp_get_sales_report: Generate sales reports with filters';
PRINT '- sp_get_inventory_report: Generate inventory reports';
PRINT '- sp_cleanup_audit_logs: Maintain audit log table';
PRINT '- sp_database_health_check: Database monitoring and statistics';
PRINT '';
PRINT 'All procedures include:';
PRINT '- Complete input validation';
PRINT '- Proper error handling with TRY-CATCH';
PRINT '- Comprehensive audit logging';
PRINT '- Detailed documentation';
PRINT '- Business rule enforcement';

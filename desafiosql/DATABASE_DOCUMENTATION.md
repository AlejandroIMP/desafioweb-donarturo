# 🗄️ Improved Database Documentation

## 📋 Overview

This documentation covers the improved database structure for the E-commerce platform with all requested enhancements implemented.

## 🚀 Key Improvements Implemented

### ✅ 1. Standardized Nomenclature (snake_case)
- **Before**: `CategoriaProductos_idCategoriaProductos`, `usuarios_idusuarios`
- **After**: `category_id`, `user_id`, `client_id`

### ✅ 2. Complete Audit/Logging System
- `audit_log` table tracks all operations (INSERT, UPDATE, DELETE)
- `error_log` table captures all system errors
- Automatic logging via stored procedures

### ✅ 3. Business Validations
- Email format validation function
- Stock validation procedures
- Business rule enforcement for orders
- Input parameter validation in all procedures

### ✅ 4. Performance Indexes
- Strategic indexes on frequently queried columns
- Filtered indexes excluding soft-deleted records
- Composite indexes for complex queries

### ✅ 5. Soft Delete Implementation
- All main tables include `is_deleted` flag
- Procedures implement soft delete instead of physical deletion
- Audit trail preserved for deleted records

### ✅ 6. Explicit Parameter Types
- All procedures use explicit parameter types
- Type validation and constraints
- Clear parameter documentation

### ✅ 7. Complete Procedure Documentation
- Inline documentation for all procedures
- Parameter descriptions and examples
- Return value documentation

### ✅ 8. Separation of Concerns
- Validation procedures separated from business logic
- Utility procedures for maintenance
- Audit procedures for logging

## 📊 Database Schema

### Main Tables Structure

```sql
-- Core business entities
users (user_id, role_id, state_id, client_id, email, full_name, ...)
clients (client_id, business_name, commercial_name, email, ...)
products (product_id, category_id, user_id, state_id, product_name, ...)
product_categories (category_id, user_id, state_id, category_name, ...)
orders (order_id, user_id, client_id, state_id, customer_name, ...)
order_details (order_detail_id, order_id, product_id, quantity, ...)

-- System tables
states (state_id, state_name, state_description, ...)
roles (role_id, role_name, role_description, ...)

-- Audit tables
audit_log (audit_id, table_name, operation_type, record_id, ...)
error_log (error_id, error_number, error_message, ...)
```

## 🔧 Key Procedures

### User Management
```sql
-- Create user with validations
EXEC sp_create_user 
    @role_id = 1,
    @state_id = 1,
    @email = 'admin@company.com',
    @full_name = 'System Administrator',
    @password_hash = 'hashed_password_here',
    @result_id = @user_id OUTPUT;

-- Authenticate user
EXEC sp_authenticate_user
    @email = 'user@company.com',
    @password_hash = 'hashed_password',
    @user_id = @user_id OUTPUT,
    @is_authenticated = @auth_result OUTPUT,
    @user_info = @user_data OUTPUT;
```

### Client Management
```sql
-- Create client
EXEC sp_create_client
    @business_name = 'Tech Solutions Ltd',
    @commercial_name = 'TechSol',
    @delivery_address = 'Main Street 123',
    @phone = '555-0123',
    @email = 'contact@techsol.com',
    @result_id = @client_id OUTPUT;
```

### Product Management
```sql
-- Create product
EXEC sp_create_product
    @category_id = 1,
    @user_id = 1,
    @state_id = 1,
    @product_name = 'Gaming Laptop',
    @brand = 'TechBrand',
    @product_code = 'LAPTOP-001',
    @stock_quantity = 50,
    @unit_price = 1299.99,
    @result_id = @product_id OUTPUT;

-- Update stock
EXEC sp_update_product_stock
    @product_id = 1,
    @quantity_change = -5,
    @operation_type = 'SALE',
    @user_id = 1;
```

### Order Management
```sql
-- Create order with details (JSON format)
DECLARE @order_details NVARCHAR(MAX) = '[
    {"product_id": 1, "quantity": 2, "unit_price": 1299.99, "discount_percentage": 5},
    {"product_id": 2, "quantity": 1, "unit_price": 899.99, "discount_percentage": 0}
]';

EXEC sp_create_order_with_details
    @user_id = 1,
    @client_id = 1,
    @state_id = 3,
    @customer_name = 'John Doe',
    @delivery_address = 'Customer Address 456',
    @phone = '555-0456',
    @email = 'john@customer.com',
    @delivery_date = '2025-06-15',
    @order_details_json = @order_details,
    @result_order_id = @order_id OUTPUT;
```

## 📈 Reports and Analytics

### Sales Report
```sql
-- Generate sales report
EXEC sp_get_sales_report
    @start_date = '2025-01-01',
    @end_date = '2025-12-31',
    @client_id = NULL, -- All clients
    @category_id = NULL, -- All categories
    @user_id = 1;
```

### Inventory Report
```sql
-- Generate inventory report
EXEC sp_get_inventory_report
    @category_id = NULL, -- All categories
    @low_stock_threshold = 10,
    @user_id = 1;
```

## 🔍 Business Views

### Active Products with Stock
```sql
SELECT * FROM vw_active_products_with_stock;
```

### Monthly Sales Summary
```sql
SELECT * FROM vw_monthly_sales_summary
WHERE sales_year = 2025;
```

### Top Clients by Consumption
```sql
SELECT TOP 10 * FROM vw_top_clients_by_consumption;
```

### Top Selling Products
```sql
SELECT TOP 10 * FROM vw_top_selling_products;
```

## 🔒 Security Features

### Password Security
- Supports bcrypt/scrypt hashes (255 character field)
- Login attempt tracking
- Account lockout after 5 failed attempts
- 30-minute lockout duration

### Audit Trail
- All operations logged with user, timestamp, IP
- Before/after values for updates
- Error logging with stack traces
- Report generation tracking

### Data Validation
- Email format validation
- Business rule enforcement
- Foreign key constraints
- Check constraints on critical fields

## 🔧 Maintenance

### Audit Log Cleanup
```sql
-- Clean up audit logs older than 365 days
EXEC sp_cleanup_audit_logs
    @days_to_keep = 365,
    @user_id = 1;
```

### Health Check
```sql
-- Database health monitoring
EXEC sp_database_health_check;
```

## 📊 Performance Optimizations

### Indexes Created
- `IX_users_email` - User login performance
- `IX_products_category_state` - Product filtering
- `IX_orders_user_client` - Order queries
- `IX_order_details_order` - Order detail lookups
- `IX_audit_log_date` - Audit query performance

### Query Optimization Tips
1. Always use parameterized queries
2. Filter by `is_deleted = 0` for active records
3. Use the provided views for common reports
4. Leverage the indexes by including relevant WHERE clauses

## 🚀 Migration from Old System

### Schema Mapping
```sql
-- Old -> New table names
usuarios -> users
Clientes -> clients  
Productos -> products
CategoriaProductos -> product_categories
Orden -> orders
OrdenDetalles -> order_details
estados -> states
rol -> roles
```

### Field Mapping
```sql
-- Old -> New field names
idusuarios -> user_id
CategoriaProductos_idCategoriaProductos -> category_id
usuarios_idusuarios -> user_id
estados_idestados -> state_id
```

## 🧪 Testing Examples

### Sample Data Insertion
```sql
-- Create test data
DECLARE @user_id INT, @client_id INT, @category_id INT, @product_id INT;

-- Create user
EXEC sp_create_user 1, 1, NULL, 'test@example.com', 'Test User', 'hashed_password', @result_id = @user_id OUTPUT;

-- Create client  
EXEC sp_create_client 'Test Company', NULL, 'Test Address', '555-0123', 'client@test.com', @result_id = @client_id OUTPUT;

-- Create category
EXEC sp_create_product_category @user_id, 1, 'Electronics', 'Electronic products', @result_id = @category_id OUTPUT;

-- Create product
EXEC sp_create_product @category_id, @user_id, 1, 'Test Product', 'TestBrand', 'TEST-001', 100, 99.99, @result_id = @product_id OUTPUT;
```

## 🔍 Troubleshooting

### Common Issues

1. **Foreign Key Violations**: Ensure referenced records exist and are not soft-deleted
2. **Email Validation Failures**: Check email format matches pattern `%@%.%`
3. **Stock Insufficient**: Verify product stock before creating orders
4. **Account Locked**: Reset with UPDATE users SET is_locked = 0, login_attempts = 0

### Error Checking
```sql
-- Check recent errors
SELECT TOP 10 * FROM error_log 
ORDER BY error_date DESC;

-- Check audit trail for specific record
SELECT * FROM audit_log 
WHERE table_name = 'products' AND record_id = 1
ORDER BY operation_date DESC;
```

This improved database system provides enterprise-level functionality with proper security, auditing, and performance optimizations while maintaining clean, maintainable code structure.

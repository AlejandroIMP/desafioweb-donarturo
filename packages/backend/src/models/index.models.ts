import Product from './products.models';
import ProductCategory from './productcategory.models';
import User from './auth.models';
import State from './state.models';
import Client from './clients.models';
import Role from './role.models';
import { Order, OrderDetail } from './orderAndDetails.models';
import { AuditLog, ErrorLog } from './audit.models';

// Product relationships
Product.belongsTo(ProductCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

Product.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Product.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'state'
});

// ProductCategory relationships
ProductCategory.hasMany(Product, {
  foreignKey: 'category_id',
  as: 'products'
});

ProductCategory.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

ProductCategory.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'state'
});

// User relationships
User.hasMany(Product, {
  foreignKey: 'user_id',
  as: 'products'
});

User.hasMany(ProductCategory, {
  foreignKey: 'user_id',
  as: 'categories'
});

User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders'
});

User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});

User.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'state'
});

// State relationships
State.hasMany(Product, {
  foreignKey: 'state_id',
  as: 'products'
});

State.hasMany(ProductCategory, {
  foreignKey: 'state_id',
  as: 'categories'
});

State.hasMany(User, {
  foreignKey: 'state_id',
  as: 'users'
});

State.hasMany(Order, {
  foreignKey: 'state_id',
  as: 'orders'
});

// Client relationships
Client.hasMany(Order, {
  foreignKey: 'client_id',
  as: 'orders'
});

// Role relationships
Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
});

// Order relationships
Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Order.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client'
});

Order.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'state'
});

Order.hasMany(OrderDetail, {
  foreignKey: 'order_id',
  as: 'details'
});

// OrderDetail relationships
OrderDetail.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

OrderDetail.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Audit relationships
AuditLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

ErrorLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

export {
  Product,
  ProductCategory,
  User,
  State,
  Client,
  Role,
  Order,
  OrderDetail,
  AuditLog,
  ErrorLog
};
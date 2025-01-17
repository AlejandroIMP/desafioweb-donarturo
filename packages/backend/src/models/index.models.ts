import Product from './products.models';
import ProductCategory from './productcategory.models';
import User from './auth.models';
import States from './state.models';

Product.belongsTo(ProductCategory, {
  foreignKey: 'CategoriaProductos_idCategoriaProductos',
  as: 'categoria'
});

Product.belongsTo(User, {
  foreignKey: 'usuarios_idusuarios',
  as: 'usuario'
});

Product.belongsTo(States, {
  foreignKey: 'estados_idestados',
  as: 'estado'
});

ProductCategory.hasMany(Product, {
  foreignKey: 'CategoriaProductos_idCategoriaProductos',
  as: 'productos'
});

User.hasMany(Product, {
  foreignKey: 'usuarios_idusuarios',
  as: 'productos'
});

States.hasMany(Product, {
  foreignKey: 'estados_idestados',
  as: 'productos'
});

export {
  Product,
  ProductCategory,
  User,
  States
};
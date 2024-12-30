import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IProductCategory } from '../interfaces/productcategory.interface';

type ProductCategoryCreationAttributes = Optional<IProductCategory, 'idCategoriaProductos' | 'fecha_creacion'>;

class ProductCategory extends Model<IProductCategory, ProductCategoryCreationAttributes> implements IProductCategory {
  declare idCategoriaProductos: number;
  declare usuarios_idusuarios: number;
  declare nombre: string;
  declare estados_idestados: number;
  declare readonly fecha_creacion: Date;
}

ProductCategory.init(
  {
    idCategoriaProductos: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarios_idusuarios: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'idusuarios',
      },
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    estados_idestados: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estados',
        key: 'idestados',
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'CategoriaProductos',
    tableName: 'CategoriaProductos',
    freezeTableName: true,
    timestamps: false,
  }
);

export default ProductCategory;
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IProduct } from '../interfaces/product.interface';

type ProductCreationAttributes = Optional<IProduct, 'idProductos' | 'fecha_creacion'>;

class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
  declare idProductos: number;
  declare CategoriaProductos_idCategoriaProductos: number;
  declare usuarios_idusuarios: number;
  declare nombre: string;
  declare marca: string;
  declare codigo: string;
  declare stock: number;
  declare estados_idestados: number;
  declare precio: number;
  declare readonly fecha_creacion: string;
  declare foto: string;
}

Product.init(
  {
    idProductos: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CategoriaProductos_idCategoriaProductos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CategoriaProductos',
        key: 'idCategoriaProductos',
      },
    },
    usuarios_idusuarios: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'idusuarios',
      }
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    marca: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    codigo: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    estados_idestados: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estados',
        key: 'idestados',
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    foto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Productos',
    tableName: 'Productos',
    timestamps: false,
    freezeTableName: true,
  }
);

export default Product;
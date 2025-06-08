import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IProduct } from '../interfaces/product.interface';

type ProductCreationAttributes = Optional<IProduct, 'product_id' | 'is_deleted' | 'created_at' | 'updated_at'>;

class Product extends Model<IProduct, ProductCreationAttributes> implements IProduct {
  declare product_id: number;
  declare category_id: number;
  declare user_id: number;
  declare state_id: number;
  declare product_name: string;
  declare brand: string;
  declare product_code: string;
  declare stock_quantity: number;
  declare unit_price: number;
  declare description: string;
  declare image_url: string;
  declare cloudinary_public_id: string;
  declare weight: number;
  declare dimensions: string;
  declare is_deleted: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Product.init(
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product_categories',
        key: 'category_id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      }
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'state_id',
      }
    },
    product_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    product_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    cloudinary_public_id: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    weight: {
      type: DataTypes.DECIMAL(8,2),
      allowNull: true,
    },
    dimensions: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    defaultScope: {
      where: {
        is_deleted: false
      }
    },
    scopes: {
      withDeleted: {
        where: {}
      }
    }
  }
);

export default Product;
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IProductCategory } from '../interfaces/productcategory.interface';

type ProductCategoryCreationAttributes = Optional<IProductCategory, 'category_id' | 'is_deleted' | 'created_at' | 'updated_at'>;

class ProductCategory extends Model<IProductCategory, ProductCategoryCreationAttributes> implements IProductCategory {
  declare category_id: number;
  declare user_id: number;
  declare state_id: number;
  declare category_name: string;
  declare category_description: string;
  declare is_deleted: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

ProductCategory.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'state_id',
      },
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    category_description: {
      type: DataTypes.STRING(500),
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
    modelName: 'ProductCategory',
    tableName: 'product_categories',
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

export default ProductCategory;
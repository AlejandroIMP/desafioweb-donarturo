import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IOrder, IOrderDetails } from '../interfaces/orderAndDetails.interface';

export type OrderCreationAttributes = Optional<IOrder, 'order_id' | 'order_number' | 'is_deleted' | 'created_at' | 'updated_at'>;

export class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  declare order_id: number;
  declare user_id: number;
  declare client_id: number;
  declare state_id: number;
  declare order_number: string;
  declare customer_name: string;
  declare delivery_address: string;
  declare phone: string;
  declare email: string;
  declare order_total: number;
  declare tax_amount: number;
  declare delivery_date: Date;
  declare special_instructions: string;
  declare is_deleted: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Order.init(
  {
    order_id: {
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
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'client_id',
      },
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'state_id',
      }
    },
    order_number: {
      type: DataTypes.VIRTUAL,
      get() {
        return `ORD-${String(this.order_id).padStart(6, '0')}`;
      }
    },
    customer_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    delivery_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    order_total: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    special_instructions: {
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
    modelName: 'Order',
    tableName: 'orders',
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
)

export type OrderDetailsCreationAttributes = Optional<IOrderDetails, 'order_detail_id' | 'is_deleted' | 'created_at'>;

export class OrderDetail extends Model<IOrderDetails, OrderDetailsCreationAttributes> implements IOrderDetails {
  declare order_detail_id: number;
  declare order_id: number;
  declare product_id: number;
  declare quantity: number;
  declare unit_price: number;
  declare line_total: number;
  declare discount_percentage: number;
  declare discount_amount: number;
  declare final_total: number;
  declare is_deleted: boolean;
  declare readonly created_at: Date;
}

OrderDetail.init(
  {
    order_detail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'order_id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    unit_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    line_total: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.quantity * this.unit_price;
      }
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    discount_amount: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.quantity * this.unit_price * this.discount_percentage) / 100;
      }
    },
    final_total: {
      type: DataTypes.VIRTUAL,
      get() {
        const lineTotal = this.quantity * this.unit_price;
        const discountAmount = (lineTotal * this.discount_percentage) / 100;
        return lineTotal - discountAmount;
      }
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
    }
  },
  {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'order_details',
    timestamps: false,
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
)


import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IClient } from '../interfaces/clients.interface';

type ClientCreationAttributes = Optional<IClient, 'client_id' | 'is_deleted' | 'created_at' | 'updated_at'>;

class Client extends Model<IClient, ClientCreationAttributes> implements IClient {
  declare client_id: number;
  declare business_name: string;
  declare commercial_name: string;
  declare delivery_address: string;
  declare phone: string;
  declare email: string;
  declare tax_id: string;
  declare is_deleted: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Client.init(
  {
    client_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    business_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    commercial_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    delivery_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [8, 20]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    tax_id: {
      type: DataTypes.STRING(20),
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
    modelName: 'Client',
    tableName: 'clients',
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

export default Client;
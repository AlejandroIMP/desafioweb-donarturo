import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IRole } from '../interfaces/role.interface';

type RoleCreationAttributes = Optional<IRole, 'role_id' | 'is_active' | 'created_at' | 'updated_at'>;

class Role extends Model<IRole, RoleCreationAttributes> implements IRole {
  declare role_id: number;
  declare role_name: string;
  declare role_description: string;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    role_description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true,
    defaultScope: {
      where: {
        is_active: true
      }
    },
    scopes: {
      withInactive: {
        where: {}
      }
    }
  }
);

export default Role;

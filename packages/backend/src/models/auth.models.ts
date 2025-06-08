import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IUser } from '../interfaces/auth.interface';

type UserCreationAttributes = Optional<IUser, 'user_id' | 'last_login' | 'failed_login_attempts' | 'locked_until' | 'password_changed_at' | 'deleted_at' | 'is_active' | 'created_at' | 'updated_at'>;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  declare user_id: number;
  declare role_id: number;
  declare state_id: number;
  declare email: string;
  declare full_name: string;
  declare password_hash: string;
  declare phone: string;
  declare birth_date: Date;
  declare last_login: Date;
  declare failed_login_attempts: number;
  declare locked_until: Date;
  declare password_changed_at: Date;
  declare deleted_at: Date;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'role_id'
      }
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'states',
        key: 'state_id'
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
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password_changed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
        deleted_at: {
      type: DataTypes.DATE,
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
    modelName: 'User',
    tableName: 'users',
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
      withDeleted: {
        where: {}
      }
    }
  }
);

export default User;
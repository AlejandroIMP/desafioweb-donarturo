import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IState } from '../interfaces/state.interface';

type StateCreationAttributes = Optional<IState, 'state_id' | 'is_active' | 'created_at' | 'updated_at'>;

class State extends Model<IState, StateCreationAttributes> implements IState {
  declare state_id: number;
  declare state_name: string;
  declare description: string;
  declare is_active: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

State.init(
  {
    state_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    state_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
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
    modelName: 'State',
    tableName: 'states',
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

export default State;
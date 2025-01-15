import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IState } from '../interfaces/state.interface';

type StatesCreationAttributes = Optional<IState, 'idestados'>;

class States extends Model<IState, StatesCreationAttributes> implements IState {
  declare idestados: number;
  declare nombre: string;
}

States.init(
  {
    idestados: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'estados',
    tableName: 'estados',
    freezeTableName: true,
    timestamps: false,
  }
);

export default States;
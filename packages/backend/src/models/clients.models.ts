import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IClient } from '../interfaces/clients.interface';

type ClientCreationAttributes = Optional<IClient, 'idClientes' >;

class Client extends Model<IClient, ClientCreationAttributes> implements IClient {
  declare idClientes: number;
  declare razon_social: string;
  declare nombre_comercial: string;
  declare direccion_entrega: string;
  declare telefono: string;
  declare email: string;
}

Client.init(
  {
    idClientes: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    razon_social: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    nombre_comercial: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    direccion_entrega: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Clientes',
    tableName: 'Clientes',
    freezeTableName: true,
    timestamps: false,
  }
);

export default Client;
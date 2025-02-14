import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IUser } from '../interfaces/auth.interface';

type UserCreationAttributes = Optional<IUser, 'idusuarios' | 'fecha_creacion' | 'Clientes_idClientes'>;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  declare idusuarios: number;
  declare rol_idrol: number;
  declare estados_idestados: number;
  declare correo_electronico: string;
  declare nombre_completo: string;
  declare user_password: string;
  declare telefono: string;
  declare fecha_nacimiento: Date;
  declare readonly fecha_creacion: Date;
  declare Clientes_idClientes: number;

}

User.init(
  {
    idusuarios: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rol_idrol: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rol',
        key: 'idrol'
      }
    },
    estados_idestados: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estados',
        key: 'idestados'
      }
    },
    correo_electronico: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    nombre_completo: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    user_password: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 0,
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    Clientes_idClientes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clientes',
        key: 'idClientes'
      }
    }
  },
  {
    sequelize,
    modelName: 'usuarios',
    tableName: 'usuarios',
    timestamps: false,
    freezeTableName: true,
  }
);

export default User;
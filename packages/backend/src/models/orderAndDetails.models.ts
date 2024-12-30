import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IOrder, IOrderDetails } from '../interfaces/orderAndDetails.interface';

type OrderCreationAttributes = Optional<IOrder, 'idOrden' | 'fecha_creacion'>;

class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  declare idOrden: number;
  declare idusuarios: number;
  declare estados_idestados: number;
  declare nombre_completo: string;
  declare direccion: string;
  declare telefono: string;
  declare correo_electronico: string;
  declare readonly fecha_creacion: Date;
  declare fecha_entrega: Date;
  declare total_orden: number;
  declare Clientes_idClientes: number;
}

Order.init(
  {
    idOrden: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idusuarios: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'idusuarios',
      },
    },
    estados_idestados: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estados',
        key: 'idestados',
      }
    },
    nombre_completo: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    correo_electronico: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_orden: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Clientes_idClientes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Clientes',
        key: 'idClientes',
      },
    },
  },
  {
    sequelize,
    modelName: 'Orden',
    tableName: 'Orden',
    freezeTableName: true,
    timestamps: false,
  }
)

type OrderDetailsCreationAttributes = Optional<IOrderDetails, 'idOrdenDetalles'>;

class OrderDetail extends Model<IOrderDetails, OrderDetailsCreationAttributes> implements IOrderDetails {
  declare idOrdenDetalles: number;
  declare idOrden: number;
  declare idProductos: number;
  declare cantidad: number;
  declare precio: number;
  declare subtotal: number;
}

OrderDetail.init(
  {
    idOrdenDetalles: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idOrden: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Orden',
        key: 'idOrden',
      },
    },
    idProductos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Productos',
        key: 'idProductos',
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'OrdenDetalles',
    tableName: 'OrdenDetalles',
    freezeTableName: true,
    timestamps: false,
  }
)

export default Order;
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { IAuditLog, IErrorLog } from '../interfaces/audit.interface';

// Audit Log Model
type AuditLogCreationAttributes = Optional<IAuditLog, 'audit_id' | 'operation_date'>;

export class AuditLog extends Model<IAuditLog, AuditLogCreationAttributes> implements IAuditLog {
  declare audit_id: number;
  declare table_name: string;
  declare operation_type: 'I' | 'U' | 'D';
  declare record_id: number;
  declare old_values: string;
  declare new_values: string;
  declare user_id: number;
  declare operation_date: Date;
  declare ip_address: string;
  declare user_agent: string;
}

AuditLog.init(
  {
    audit_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    table_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    operation_type: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      validate: {
        isIn: [['I', 'U', 'D']]
      }
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    old_values: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_values: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    operation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_log',
    timestamps: false,
    freezeTableName: true,
  }
);

// Error Log Model
type ErrorLogCreationAttributes = Optional<IErrorLog, 'error_id' | 'error_date'>;

export class ErrorLog extends Model<IErrorLog, ErrorLogCreationAttributes> implements IErrorLog {
  declare error_id: number;
  declare error_number: number;
  declare error_severity: number;
  declare error_state: number;
  declare error_procedure: string;
  declare error_line: number;
  declare error_message: string;
  declare user_id: number;
  declare error_date: Date;
  declare additional_info: string;
}

ErrorLog.init(
  {
    error_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    error_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    error_severity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    error_state: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    error_procedure: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    error_line: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    error_message: {
      type: DataTypes.STRING(4000),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    error_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    additional_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'ErrorLog',
    tableName: 'error_log',
    timestamps: false,
    freezeTableName: true,
  }
);

export { AuditLog as default };

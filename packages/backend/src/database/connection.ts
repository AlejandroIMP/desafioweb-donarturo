/**
 * Configuración de la conexión a la base de datos usando Sequelize ORM para PostgreSQL.
 * 
 * Variables de entorno requeridas:
 * - DB_DATABASE: Nombre de la base de datos
 * - DB_USER: Usuario de la base de datos
 * - DB_PASSWORD: Contraseña de la base de datos 
 * - DB_SERVER: Host de la base de datos
 * - DB_PORT: Puerto de la base de datos (opcional, por defecto 5432)
 * - DB_SSL: 'true' para activar SSL (opcional)
 * 
 * La conexión:
 * - Usa el dialecto postgres
 * - Configura SSL mediante dialectOptions en caso necesario
 * - Realiza logging en consola
 * 
 * En el arranque:
 * 1. Se autentica la conexión
 * 2. Se sincronizan los modelos sin alterar las tablas existentes
 * 
 * @module database/connection
 * @exports {Sequelize} Instancia configurada de Sequelize
 */
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT) || 5432,
  dialectOptions: process.env.DB_SSL === 'true'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  logging: console.log,
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });

sequelize.sync({ alter: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

export default sequelize;
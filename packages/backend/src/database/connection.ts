/**
 * Database connection configuration using Sequelize ORM
 * 
 * This module establishes and exports a database connection using Sequelize.
 * It connects to a Microsoft SQL Server database using environment variables
 * for sensitive configuration.
 * 
 * Environment variables required:
 * - DB_DATABASE: Database name
 * - DB_USER: Database username
 * - DB_PASSWORD: Database password 
 * - DB_SERVER: Database server host
 * 
 * The connection:
 * - Uses MSSQL dialect
 * - Runs on port 1433
 * - Has encryption disabled
 * - Trusts server certificate
 * - Includes logging to console
 * 
 * On startup:
 * 1. Authenticates the connection
 * 2. Synchronizes models without altering existing tables
 * 
 * @module database/connection
 * @exports {Sequelize} Default export is the configured Sequelize instance
 */
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
  {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER,
    dialect: 'mssql',
    port: 1433,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    },
    logging: console.log
  }
);


sequelize.authenticate().then(() => {
  console.log('Database connected');
}
).catch(err => {
  console.error('Error connecting to database:', err);
});


sequelize.sync({ alter: false }).then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database:', err);
});

export default sequelize;
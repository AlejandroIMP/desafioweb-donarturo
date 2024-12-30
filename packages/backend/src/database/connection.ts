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
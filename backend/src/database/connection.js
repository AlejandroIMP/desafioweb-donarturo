import sql from 'mssql';
import 'dotenv/config';

const dbsettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

export const getConnection = async () => {
  try{
    const pool = await sql.connect(dbsettings);

    return pool;
  }
  catch(err){
    console.log(err);
  }
}
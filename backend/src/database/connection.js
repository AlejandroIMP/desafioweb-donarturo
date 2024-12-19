import sql from 'mssql';

const dbsettings = {
  user: 'sa',
  password: "'dockerE#4'",
  server: 'localhost',
  database: 'GDA004-OT-DavidSian',
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
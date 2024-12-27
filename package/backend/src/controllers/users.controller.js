// import {getConnection} from '../database/connection.js';

// export const getUser = async (req, res) => {
//     const pool = await getConnection();

//     const result = await pool.request().query('SELECT * FROM Usuarios');

//     console.log(result);

//     res.send('GET clientes');
// };

// export const getUserById = async (req, res) => {
//   try {
//       const { id } = req.params;
//       const pool = await getConnection();
//       const result = await pool.request()
//           .input('id', id)
//           .query('SELECT * FROM Usuarios WHERE idUsuarios = @id');  
      
//       if (result.recordset.length > 0) {
//           res.json(result.recordset[0]);
//       } else {
//           res.status(404).json({ message: 'Usuario no encontrado' });
//       }
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };

// export const createUser = (req, res) => {
//     res.send('POST Usuarios');
// };

// export const updateUser = (req, res) => {
//     res.send('PUT Usuarios/:id');
// };

// export const deleteUser = (req, res) => {
//     res.send('DELETE Usuarios/:id');
// };
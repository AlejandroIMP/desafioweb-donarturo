import AdminLayout from '@/layouts/AdminLayout';
import { IUser } from '@/interfaces/auth.interface';
import { getUsers } from '@/services/users.service';
import { formattedDate, formattedRole, formattedState } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';

const UserManagment = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div>UserManagment</div>

        {
          loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>There was an error</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>rol</th>
                  <th>Estado</th>
                  <th>correo_electronico</th>
                  <th>nombre_completo</th>
                  <th>telefono</th>
                  <th>fecha_nacimiento</th>
                  <th>fecha_creacion</th>
                  <th>Clientes_idClientes</th>
                </tr>
              </thead>
              <tbody >
                {users.map((user) => (
                  <tr key={user.idusuarios}>
                    <td>{user.idusuarios}</td>
                    <td>{formattedRole(user.rol_idrol)}</td>
                    <td>{formattedState(user.estados_idestados)}</td>
                    <td>{user.correo_electronico}</td>
                    <td>{user.nombre_completo}</td>
                    <td>{user.telefono}</td>
                    <td>{formattedDate(user.fecha_nacimiento)}</td>
                    <td>{formattedDate(user.fecha_creacion)}</td>
                    <td>{user.Clientes_idClientes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
    </AdminLayout>
  );
};

export default UserManagment;

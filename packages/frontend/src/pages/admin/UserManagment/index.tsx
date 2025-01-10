import AdminLayout from '@/layouts/AdminLayout';
import { IUser } from '@/interfaces/auth.interface';
import { getUsers, updateUsersState } from '@/services/users.service';
import UserFormCreate from '@/components/UserCreateForm';
import UserFormUpdate from '@/components/UserUpdateForm';
import { formattedDate, formattedRole } from '@/utils/orderUtils';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LabelState from '@/components/LabelState';
import EditIcon from '@mui/icons-material/Edit';
import './index.css';

const UserManagment = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser>({
    idusuarios: 0,
    rol_idrol: 0,
    estados_idestados: 0,
    correo_electronico: '',
    nombre_completo: '',
    user_password: '',
    telefono: '',
    fecha_nacimiento: '',
    fecha_creacion: '',
    Clientes_idClientes: 0
  });

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

  const handleOpenModalEdit = (user: IUser) => {
    setSelectedUser(user);
    setOpenModalEdit(true);
  };

  const handleCloseModalEdit = () => {
    setSelectedUser({
      idusuarios: 0,
      rol_idrol: 0,
      estados_idestados: 0,
      correo_electronico: '',
      nombre_completo: '',
      user_password: '',
      telefono: '',
      fecha_nacimiento: '',
      fecha_creacion: '',
      Clientes_idClientes: 0
    });
    setOpenModalEdit(false);
  };

  const handleOpenModalAdd = () => {
    setOpenModalAdd(true);
  };

  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
  };

  const desactivarUsuario = async (id: number) => {
    try {
      await updateUsersState(id, 2);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const activarUsuario = async (id: number) => {
    try {
      await updateUsersState(id, 1);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const isUserActive = (user: IUser) => {
    return user.estados_idestados === 1;
  }

  return (
    <AdminLayout>
      <div className='management-container'>
        <div className='management-header'>
          <h1 className="management-title">Manejo de usuarios</h1>
          <Button
            variant='contained'
            color='primary'
            onClick={handleOpenModalAdd}
          >
            Agregar usuario
          </Button>
        </div>
        {
          loading ? (
            <div className='loading-state'>Cargando Usuarios...</div>
          ) : error ? (
            <div className='error-state'>Ha habido un error al cargar usuarios</div>
          ) : (
            <table className='management-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>correo electronico</th>
                  <th>Nombre</th>
                  <th>Telefono</th>
                  <th>Fecha Nacimiento</th>
                  <th>Fecha creacion</th>
                  <th>Clientes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody >
                {users.map((user) => (
                  <tr key={user.idusuarios}>
                    <td data-label='Id'>{user.idusuarios}</td>
                    <td data-label='Rol'>{formattedRole(user.rol_idrol)}</td>
                    <LabelState estados={user.estados_idestados} />
                    <td data-label='correo'>{user.correo_electronico}</td>
                    <td data-label='nombre'>{user.nombre_completo}</td>
                    <td data-label='telefono'>{user.telefono}</td>
                    <td data-label='fecha_nacimiento'>{formattedDate(user.fecha_nacimiento)}</td>
                    <td data-label='fecha_creacion'>{formattedDate(user.fecha_creacion)}</td>
                    <td data-label='clientes'>{user.Clientes_idClientes}</td>
                    <td className='product-actions'>
                      <Button
                        variant='text'
                        color='primary'
                        onClick={() => handleOpenModalEdit(user)}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="text"
                        color="success"
                        disabled={isUserActive(user)}
                        onClick={() => activarUsuario(user.idusuarios)}
                      >
                        Activar
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        disabled={!isUserActive(user)}
                        onClick={() => desactivarUsuario(user.idusuarios)}
                      >
                        Desactivar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
        <Dialog
          open={openModalEdit}
          onClose={handleCloseModalEdit}
          maxWidth="md"
          fullWidth
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
          }}>
            <IconButton
              onClick={handleCloseModalEdit}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <UserFormUpdate usuario={selectedUser} /> 
          </div>
        </Dialog>
        <Dialog
          open={openModalAdd}
          onClose={handleCloseModalAdd}
          maxWidth="md"
          fullWidth
        >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px'
          }}>
            <IconButton
              onClick={handleCloseModalAdd}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <div>
            <UserFormCreate />
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UserManagment;

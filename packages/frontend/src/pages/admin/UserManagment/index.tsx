import AdminLayout from '@/layouts/AdminLayout';
import { IUser } from '@/interfaces/auth.interface';
import { getUsers } from '@/services/users.service';
import UserFormCreate from '@/components/UserCreateForm';
import UserFormUpdate from '@/components/UserUpdateForm';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './index.css';
import TableUsersManagment from '@/components/TableUsersManagment';

const UserManagment = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser>({
    user_id: 0,
    role_id: 0,
    state_id: 0,
    email: '',
    full_name: '',
    password_hash: '',
    phone: '',
    birth_date: '',
    created_at: '',
    client_id: 0
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
      user_id: 0,
      role_id: 0,
      state_id: 0,
      email: '',
      full_name: '',
      password_hash: '',
      phone: '',
      birth_date: '',
      created_at: '',
      client_id: 0
    });
    setOpenModalEdit(false);
  };

  const handleOpenModalAdd = () => {
    setOpenModalAdd(true);
  };

  const handleCloseModalAdd = () => {
    setOpenModalAdd(false);
  };

  return (
    <AdminLayout>
      <div className="management-header">
        <h1 className="management-title">Manejo de Usuarios</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModalAdd}
        >
          Añadir Usuario
        </Button>
      </div>

      {
        loading ? (
          <div className='loading-state'>Cargando Usuarios...</div>
        ) : error ? (
          <div className='error-state'>Ha habido un error al cargar usuarios</div>
        ) : (
          <TableUsersManagment
            users={users}
            handleOpenModalEdit={handleOpenModalEdit}
          />
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
    </AdminLayout>
  );
};

export default UserManagment;

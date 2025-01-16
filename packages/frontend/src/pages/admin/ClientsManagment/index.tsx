import AdminLayout from '@/layouts/AdminLayout';
import { IClient } from '@/interfaces/clients.interface';
import { getClients } from '@/services/clients.service';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClientCreateForm from '@/components/ClientCreateForm';
import ClientUpdateForm from '@/components/ClientUpdateForm';
import TableClientsManagment from '@/components/TableClientsManagment';


const ClientsManagment = () => {
	const [clients, setClients] = useState<IClient[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [openModalAdd, setOpenModalAdd] = useState(false);
	const [openModalEdit, setOpenModalEdit] = useState(false);
	const [SelectedClient, setSelectedClient] = useState<IClient>({
		idClientes: 0,
		razon_social: '',
		nombre_comercial: '',
		direccion_entrega: '',
		telefono: '',
		email: ''
	});

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const response = await getClients();
				setClients(response.data);
			} catch (error) {
				setError(true);
			} finally {
				setLoading(false);
			}
		}
		fetchClients();
	}
		, []);


	const handleOpenModalEdit = (client: IClient) => {
		setSelectedClient(client);
		setOpenModalEdit(true);
	};

	const handleCloseModalEdit = () => {
		setSelectedClient({
			idClientes: 0,
			razon_social: '',
			nombre_comercial: '',
			direccion_entrega: '',
			telefono: '',
			email: ''
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
			<div className='management-container'>
				<div className='management-header'>
					<h1 className="management-title">Manejo de clientes</h1>
					<Button
						variant='contained'
						color='primary'
						onClick={handleOpenModalAdd}
					>
						Agregar cliente
					</Button>
				</div>
				{
					loading ? (
						<div className='loading-state'>Cargando Clientes...</div>
					) : error ? (
						<div className='error-state'>Ha habido un error al cargar clientes</div>
					) : (
					
							<TableClientsManagment clients={clients} handleOpenModalEdit={handleOpenModalEdit} />
					
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
            <ClientUpdateForm client={SelectedClient} onClose={handleCloseModalEdit} />
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
            <ClientCreateForm />
          </div>
        </Dialog>
			</div>
		</AdminLayout>
	);
};

export default ClientsManagment;

import AdminLayout from '@/layouts/AdminLayout';
import { IClient } from '@/interfaces/clients.interface';
import { getClients } from '@/services/clients.service';
import { useState, useEffect } from 'react';
import { Dialog, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClientCreateForm from '@/components/ClientCreateForm';
import ClientUpdateForm from '@/components/ClientUpdateForm';


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
						<div>
							<table className='management-table'>
								<thead>
									<tr>
										<th>ID</th>
										<th>Razon social</th>
										<th>Nombre comercial</th>
										<th>Direccion de entrega</th>
										<th>Telefono</th>
										<th>Correo Electronico</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{clients.map((client) => (
										<tr key={client.idClientes}>
											<td data-label='ID'>{client.idClientes}</td>
											<td data-label='Razon Social'>{client.razon_social}</td>
											<td data-label='Nombre comercial'>{client.nombre_comercial}</td>
											<td data-label='Direccion entrega'>{client.direccion_entrega}</td>
											<td data-label='Telefono'>{client.telefono}</td>
											<td data-label='Correo Electronico'>{client.email}</td>
											<td className='product-actions'>
												<Button
													variant='text'
													color='primary'
													onClick={() => handleOpenModalEdit(client)}
												>
													Editar
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
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
import AdminLayout from '@/layouts/AdminLayout';
import { IClient } from '@/interfaces/clients.interface';
import { getClients } from '@/services/clients.service';
import { useState, useEffect } from 'react';


const ClientsManagment = () => {
	const [clients, setClients] = useState<IClient[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

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

  return (
	<AdminLayout>
	  Clients
		{
			loading ? (
				<div>Loading...</div>
			) : error ? (
				<div>Error occurred</div>
			) : (
				<div>
					<table>
						<thead>
							<tr>
								<th>Id</th>
								<th>razon social</th>
								<th>nombre comercial</th>
								<th>direccion de entrega</th>
								<th>Telefono</th>
								<th>email</th>
							</tr>
						</thead>
						<tbody>
							{clients.map((client) => (
								<tr key={client.idClientes}>
									<td>{client.idClientes}</td>
									<td>{client.razon_social}</td>
									<td>{client.nombre_comercial}</td>
									<td>{client.direccion_entrega}</td>
									<td>{client.telefono}</td>
									<td>{client.email}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)
		}
	</AdminLayout>
  );
};

export default ClientsManagment;
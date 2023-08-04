import Link from 'next/link';

const ClientsPage = () => {
	const clients = [
		{ id: 'max', name: 'Maximilian' },
		{ id: 'mannel', name: 'Manuel' },
	];

	return (
		<div>
			<h1>The Clients Page</h1>
			<ul>
				{clients.map(({ id, name }) => (
					<li key={id}>
						{/* <Link href={`/clients/${id}`}>{name}</Link> */}
						<Link
							href={{
								pathname: '/clients/[id]',
								query: { id },
							}}
						>
							{name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ClientsPage;

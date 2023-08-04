// http://localhost:3000/clients/a
import { useRouter } from 'next/router';

const ClientProjectsPage = () => {
	const router = useRouter();

	function loadProjectHandler() {
		// load data...
		// router.push('/clients/max/projectA'); // replace
		router.push({
			pathname: '//clients/[id]/[clientprojectid]',
			query: {
				id: 'max',
				clientprojectid: 'projectA',
			},
		});
	}

	return (
		<div>
			<h1>The Projects of a Given Client</h1>
			<button onClick={loadProjectHandler}>Load Project A</button>
		</div>
	);
};

export default ClientProjectsPage;

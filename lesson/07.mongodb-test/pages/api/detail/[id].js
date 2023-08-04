import { connectDatabase, getDocumentById, deleteDocumentById } from '../../../helpers/db-util';

export default async function handler(req, res) {
	let client;

	try {
		client = await connectDatabase();
	} catch (error) {
		res.status(500).json({ message: 'Connecting to the database failed!' });
		return;
	}

	if (req.method === 'DELETE') {
		try {
			const { id } = req.query;
			console.log(`delete id: ${id}`);
			const response = await getDocumentById(client, 'products', id);
			if (!response) {
				res.status(500).json({ message: 'there is no data by id', result: false });
			} else {
				const result = await deleteDocumentById(client, 'products', id);
				if (result) {
					res.status(200).json({ message: 'delete success', result: true });
				} else {
					res.status(500).json({ message: 'there is no data by id', result: false });
				}
			}
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'Delete failed!', result: false });
		}
	}

	client.close();
}

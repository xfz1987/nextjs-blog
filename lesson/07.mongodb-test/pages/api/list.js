import { connectDatabase, getAllDocuments, insertDocument } from '../../helpers/db-util';

export default async function handler(req, res) {
	let client;

	try {
		client = await connectDatabase();
	} catch (error) {
		res.status(500).json({ message: 'Connecting to the database failed!' });
		return;
	}

	if (req.method === 'GET') {
		try {
			// products - table
			const documents = await getAllDocuments(client, 'products', { _id: -1 });
			res.status(200).json({ data: documents });
			console.log('查询所有数据', documents);
		} catch (error) {
			res.status(500).json({ message: 'Getting comments failed.' });
		}
	} else {
		const { text } = req.body;
		if (!text || !text.trim()) {
			res.status(422).json({ message: 'Invalid input.' });
			client.close();
			return;
		}

		const newProduct = { text };
		try {
			const result = await insertDocument(client, 'products', newProduct);
			console.log('insert success:', result.insertedId);
			res.status(201).json({ message: 'Added success.', data: { _id: result.insertedId, ...newProduct } });
		} catch (error) {
			res.status(500).json({ message: 'Inserting comment failed!' });
		}
	}

	client.close();
}

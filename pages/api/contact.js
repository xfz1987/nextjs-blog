import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { email, name, message } = req.body;
		if (!email || !email.includes('@') || !name || name.trim() === '' || !message || message.trim() === '') {
			res.status(422).json({ message: 'Invalid input.' });
			return;
		}
		const newMessage = {
			email,
			name,
			message,
		};
		let client;
		try {
			client = await MongoClient.connect(
				`mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_clustername}.jdiygge.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`
				// 'mongodb+srv://xfz:2MBYB09wuR3HQrnq@cluster0.jdiygge.mongodb.net/test?retryWrites=true&w=majority'
			);
		} catch (error) {
			res.status(500).json({ message: 'Could not connect to database.' });
			return;
		}
		const db = client.db();

		try {
			const result = await db.collection('messages').insertOne(newMessage);
			newMessage.id = result.insertedId;
			res.status(201).json({ message: 'Successfully saved message!', message: newMessage });
		} catch (error) {
			res.status(500).json({ message: 'Saving message failed!' });
		} finally {
			client.close();
		}
	}
}

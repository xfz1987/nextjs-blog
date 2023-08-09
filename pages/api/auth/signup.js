import { connectToDatabase } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return;
	}

	const { email, password } = req.body;

	if (!email || !email.includes('@') || !password || password.trim().length < 6) {
		res.status(422).json({
			message: 'Invalid input - password should also be at least 6 characters long.',
		});
		return;
	}

	let client;

	try {
		client = await connectToDatabase();
	} catch (e) {
		res.status(500).json({ message: 'Could not connect to database.' });
		return;
	}

	const db = client.db();

	try {
		// 1. check the new emial is existing or not
		const existedUser = await db.collection('users').findOne({ email });
		if (existedUser) {
			res.status(422).json({ message: 'User exists already!' });
			client.close();
			return;
		}

		// 2.encrpt the passwrod
		const hashedPawword = await hashPassword(password);

		// 3.insert new user
		await db.collection('users').insertOne({
			email,
			password: hashedPawword,
		});

		res.status(201).json({ message: 'Created user success!' });
	} catch (e) {
		res.status(500).json({ message: 'Created user failed!' });
	} finally {
		client.close();
	}
}

import { connectToDatabase } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
	if (req.method !== 'PATCH') {
		return;
	}

	// 1.check session
	const session = await getServerSession(req, res, authOptions);

	if (!session) {
		res.status(401).json({ message: 'Not authenticated!' });
		return;
	}

	// 2.check password
	const userEmail = session.user.email;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;

	const client = await connectToDatabase();
	const usersCollection = client.db().collection('users');
	const user = await usersCollection.findOne({ email: userEmail });

	if (!user) {
		res.status(404).json({ message: 'User not found.' });
		client.close();
		return;
	}

	const isValid = await verifyPassword(oldPassword, user.password);

	if (!isValid) {
		res.status(403).json({ message: 'Invalid password.' });
		client.close();
		return;
	}

	const hashedPassword = await hashPassword(newPassword);

	const result = await usersCollection.updateOne({ email: userEmail }, { $set: { password: hashedPassword } });

	client.close();
	res.status(200).json({ message: 'Password updated!' });
}

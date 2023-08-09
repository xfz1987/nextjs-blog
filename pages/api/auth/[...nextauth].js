/**
 * Authentication
 * used for login or logout
 * http://localhost:3000/api/auth/callback/credentials?
 */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';

export const authOptions = {
	// secret: process.env.AUTH_SECRET,
	secret: 'test', //
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			session: {
				strategy: 'jwt',
			},
			// verify logic
			async authorize(credentials, req) {
				const client = await connectToDatabase();
				const usersCollection = client.db().collection('users');
				const user = await usersCollection.findOne({
					email: credentials.email,
				});

				if (!user) {
					client.close();
					throw new Error('No user found!');
				}

				const isValid = await verifyPassword(credentials.password, user.password);

				if (!isValid) {
					client.close();
					throw new Error('Could not log you in!');
				}

				client.close();

				return { email: user.email };
			},
		}),
		// ...other providers
	],
	// callbacks: {
	// 	async session({ session, token, user }) {
	// 		return session;
	// 	},
	// },
};

export default NextAuth(authOptions);

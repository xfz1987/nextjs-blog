import { getSession } from 'next-auth/react';
import UserProfile from '@/components/profile/user-profile';

function ProfilePage() {
	return <UserProfile />;
}

// protect router
export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req });

	if (!session) {
		return {
			redirect: {
				destination: '/auth',
				permanent: false, // 永久重定向
			},
		};
	}

	return {
		props: { session },
	};
}

export default ProfilePage;

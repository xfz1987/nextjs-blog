import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, getSession } from 'next-auth/react';
import AuthForm from '@/components/auth/auth-form';

export default function AuthPage() {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	// const { data: session } = useSession();
	useEffect(() => {
		getSession().then(session => {
			if (session) {
				router.replace('/');
			} else {
				setIsLoading(false);
			}
		});
	}, [router]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return <AuthForm />;
}

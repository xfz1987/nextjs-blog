import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/layout/layout';
import '@/styles/globals.css';

function MyApp({ Component, pageProps: { session, ...rest } }) {
	return (
		<SessionProvider session={session}>
			<Layout>
				<Component {...rest} />
			</Layout>
		</SessionProvider>
	);
}

export default MyApp;

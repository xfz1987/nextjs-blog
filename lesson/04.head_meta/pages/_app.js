import Head from 'next/head';

import '../styles/globals.css';

export default function App({ Component, pageProps }) {
	return (
		<div className='layout'>
			<Head>
				<title>Next Events</title>
				<meta
					name='description'
					content='NextJS Events'
				/>
				<meta
					name='viewport'
					content='initial-scale=1.0, width=device-width'
				/>
			</Head>
			<Component {...pageProps} />
		</div>
	);
}

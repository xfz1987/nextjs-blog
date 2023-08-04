import Head from 'next/head';
import { useRouter } from 'next/router';

// [...params].jsx
function ProductDetailPage() {
	const {
		query: { params = [] },
	} = useRouter();

	return (
		<>
			<Head>
				<title>{params[0] || 'detail'}</title>
				<meta
					name='description'
					content={params[1] || 'this is a detail'}
				/>
			</Head>
			<h1>Product Detail Page</h1>
		</>
	);
}

export default ProductDetailPage;

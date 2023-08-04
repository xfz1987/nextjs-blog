import Head from 'next/head';

function ProductPage() {
	return (
		<>
			<Head>
				<title>test1</title>
				<meta
					name='description'
					content='666'
				/>
			</Head>
			<Head>
				<title>test2</title>
			</Head>
			<h1>Product Page</h1>
		</>
	);
}

export default ProductPage;

import { join } from 'path';
import fs from 'fs/promises';
import Link from 'next/link';

function HonePage({ products = [] }) {
	return (
		<ul>
			{products.map(({ id, title }) => (
				<li key={id}>
					<Link href={`/products/${id}`}>{title}</Link>
				</li>
			))}
		</ul>
	);
}

// This function is always only running in server
export async function getStaticProps(context) {
	console.log('(Re-)Generating...');
	const filePath = join(process.cwd(), 'data', 'dummy-backend.json');
	const jsonData = await fs.readFile(filePath);
	const data = JSON.parse(jsonData);

	if (!data) {
		return {
			redirect: {
				destination: '/no-data',
			},
		};
	}

	if (!data.products.length) {
		return { notFound: true };
	}

	return {
		props: {
			products: data.products,
		},
		revalidate: 10, // 增量静态生成（ISR）
	};
}

export default HonePage;

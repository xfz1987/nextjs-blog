import fs from 'fs/promises';
import { join } from 'path';

function ProductDetailPage({ product }) {
	const { title, description } = product;

	return (
		<>
			<h1>{title}</h1>
			<p>{description}</p>
		</>
	);
}

async function getData() {
	const filePath = join(process.cwd(), 'data', 'dummy-backend.json');
	const jsonData = await fs.readFile(filePath);
	return JSON.parse(jsonData);
}

// If you want use context，you must use getStaticPaths as well
// because getStaticProps as a pre-rendering function, that can only excute in server, not in broswer
// as there's no broswers，wo can not get the params from context，so getStaticPaths support the mock params
export async function getStaticProps(context) {
	const {
		params: { pid },
	} = context;
	const data = await getData();
	const product = data.products.find(product => product.id === pid);

	if (!product) {
		return { notFound: true };
	}

	return {
		props: {
			product,
		},
	};
}

// Tell server what you want to generate static pages
export async function getStaticPaths(context) {
	const data = await getData();
	const ids = data.products.map(product => product.id);
	const pathsWithParms = ids.map(pid => ({ params: { pid } }));

	return {
		paths: pathsWithParms,
		fallback: false,
	};
}

export default ProductDetailPage;

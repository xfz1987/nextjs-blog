/**
 * static pre-render - prepare previous last data
 * fetch data in client
 */

import { useEffect, useState } from 'react';
import useSWR from 'swr';

function LastSalesPage(props) {
	const [sales, setSales] = useState(props.sales);

	const { data, error } = useSWR('https://nextjs-course-c81cc-default-rtdb.firebaseio.com/sales.json', url =>
		fetch(url).then(res => res.json())
	);

	// pre-rendering will not execute useEffect
	useEffect(() => {
		if (data) {
			const transformedSales = [];

			for (const key in data) {
				transformedSales.push({
					id: key,
					username: data[key].username,
					volume: data[key].volume,
				});
			}

			setSales(transformedSales);
		}
	}, [data]);

	if (error || error === undefined) {
		return <p>Failed to load.</p>;
	}

	if (!data && !sales) {
		return <p>Loading....</p>;
	}

	return (
		<ul>
			{sales.map(sale => (
				<li key={sale.id}>
					{sale.username} - ${sale.volume}
				</li>
			))}
		</ul>
	);
}

export async function getStaticProps() {
	const response = await fetch('https://nextjs-course-c81cc-default-rtdb.firebaseio.com/sales.json');
	const data = await response.json();
	// const transformedSales = [];

	// for (const key in data) {
	// 	transformedSales.push({
	// 		id: key,
	// 		username: data[key].username,
	// 		volume: data[key].volume,
	// 	});
	// }

	return { props: { sales: [] } };
}

export default LastSalesPage;

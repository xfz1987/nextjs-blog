import { useState, useEffect, useRef } from 'react';

function HomePage({ data = [] }) {
	const [list, setList] = useState(data);
	const [loading, setLoading] = useState(false);
	const inputRef = useRef('');

	// useEffect(() => {
	// 	setLoading(true);
	// 	fetch('/api/list')
	// 		.then(res => res.json())
	// 		.then(data => setList(data.data))
	// 		.catch(e => console.error(e))
	// 		.finally(() => setLoading(false));
	// }, []);

	async function addOne() {
		const text = inputRef.current.value;
		if (!text || !text.trim()) {
			alert('Invalid input..');
			return;
		}

		const data = { text };

		try {
			setLoading(true);
			const result = await fetch('/api/list', {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const res = await result.json();
			setList([res.data, ...list]);
			inputRef.current.value = '';
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	async function deleteById(id) {
		try {
			const response = await fetch(`/api/detail/${id}`, {
				method: 'DELETE',
			});
			const { result } = await response.json();
			if (result) {
				setList(prev => prev.filter(item => item._id !== id));
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<div>
			<h1>Home Page</h1>
			<ul>
				{list.map(item => (
					<li key={item._id}>
						{item.text} <button onClick={() => deleteById(item._id)}>x</button>
					</li>
				))}
			</ul>
			<hr />
			<input
				type='text'
				ref={inputRef}
			/>
			<button
				disabled={loading}
				onClick={addOne}
			>
				add
			</button>
		</div>
	);
}

export async function getServerSideProps() {
	let data = [];

	try {
		const res = await fetch('http://localhost:3000/api/list');
		const resData = await res.json();
		data = resData.data;
	} catch (e) {
		console.log(e);
	}

	return {
		props: {
			data,
		},
	};
}

export default HomePage;

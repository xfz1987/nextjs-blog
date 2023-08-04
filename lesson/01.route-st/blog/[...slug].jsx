// http://localhost:3000/blog/2023  ['2023']
// http://localhost:3000/blog/2023/8  ['2023', '8']
// http://localhost:3000/blog/2023/8/...  ['2023', '8', '...']

import { useRouter } from 'next/router';

const BlogPage = () => {
	const {
		query: { slug },
	} = useRouter();
	console.log(slug); // ['2023', '8']

	return (
		<div>
			<h1>The Blog Page</h1>
		</div>
	);
};

export default BlogPage;

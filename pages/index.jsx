import Head from 'next/head';
import Hero from '@/components/home-page/hero';
import FeaturedPosts from '@/components/home-page/featured-posts';
import { getFeaturedPosts } from '@/lib/posts-util';

function HomePage({ posts = [] }) {
	return (
		<>
			<Head>
				<title>Ryyun's Blog</title>
				<meta
					name="description"
					content="I post about programming and web development."
				/>
			</Head>
			<Hero />
			<FeaturedPosts posts={posts} />
		</>
	);
}

export async function getStaticProps() {
	const posts = getFeaturedPosts();

	return {
		props: {
			posts,
		},
	};
}

export default HomePage;

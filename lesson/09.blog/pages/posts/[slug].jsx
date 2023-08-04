import Head from 'next/head';
import PostContent from '@/components/posts/detail/post-content';
import { getPostData, getPostsFiles } from '@/lib/posts-util';

function PostDetailPage({ post = {} }) {
	const { title, excerpt } = post;

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta
					name='description'
					content={excerpt}
				/>
			</Head>
			<PostContent post={post} />
		</>
	);
}

export function getStaticProps(context) {
	const {
		params: { slug },
	} = context;
	const post = getPostData(slug);

	return {
		props: {
			post,
		},
		revalidate: 3000,
	};
}

export function getStaticPaths() {
	const postFilenames = getPostsFiles();

	const slugs = postFilenames.map(fileName => fileName.replace(/\.md$/, ''));

	return {
		paths: slugs.map(slug => ({ params: { slug } })),
		fallback: false,
	};
}

export default PostDetailPage;

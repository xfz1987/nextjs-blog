import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), 'articles');

/**
 * List the filenames of the directory named articles
 */
export function getPostsFiles() {
	return fs.readdirSync(postsDirectory);
}

export function getPostData(postIdentifier) {
	const postSlug = postIdentifier.replace(/\.md$/, ''); // removes the file extension
	const filePath = join(postsDirectory, `${postSlug}.md`);
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const { data, content } = matter(fileContent);

	return {
		slug: postSlug,
		...data, // -- xxx -- 里面的内容，并转换成object
		content, // 正文
	};
}

export function getAllPosts() {
	const postFiles = getPostsFiles();

	const allPosts = postFiles.map(postFile => {
		return getPostData(postFile);
	});

	const sortedPosts = allPosts.sort((postA, postB) => (postA.date > postB.date ? -1 : 1));

	return sortedPosts;
}

export function getFeaturedPosts() {
	const allPosts = getAllPosts();
	const featuredPosts = allPosts.filter(post => post.isFeatured);

	return featuredPosts;
}

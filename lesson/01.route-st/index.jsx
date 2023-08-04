import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const HomePage = () => {
	return (
		<div className={styles.container}>
			<h1>The Home Page</h1>
			<ul>
				<li>
					{/* This is will open another new page without local refesh*/}
					{/* <a href="/portfolio">Portfolio</a> */}
					<Link
						prefetch
						href='/portfolio'
					>
						Portfolio
					</Link>
				</li>
				<li>
					<Link href='/clients'>Clients</Link>
				</li>
				<li>
					<Link href='/about'>About</Link>
				</li>
			</ul>
		</div>
	);
};

export default HomePage;
